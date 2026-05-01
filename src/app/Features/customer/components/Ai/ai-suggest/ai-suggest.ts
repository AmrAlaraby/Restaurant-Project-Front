import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SuggestResultDTO } from '../../../../../Core/Models/AiModels/suggest-result-dto';
import { IngredientInterface } from '../../../../../Core/Models/MenuItemModels/ingredient-interface';
import { AiSuggestService } from '../../../../../Core/Services/Ai-Service/ai-suggest';
import { IngredientsService } from '../../../../../Core/Services/Ingredients-Service/ingredients-Service';
import { TranslatePipe } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { LocalizationService } from '../../../../../Core/Services/Localization-Service/localization-service';


@Component({
  selector: 'app-ai-suggest',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe],
  templateUrl: './ai-suggest.html',
  styleUrls: ['./ai-suggest.scss'],
})
export class AiSuggestComponent implements OnInit {
  // ── Ingredients Dropdown ──────────────────────────────────────
  allIngredients = signal<IngredientInterface[]>([]);
  selectedIngredients = signal<IngredientInterface[]>([]);
  dropdownOpen = signal(false);
  searchQuery = signal('');
  ingredientsLoading = signal(false);

  filteredIngredients = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    const selected = this.selectedIngredients().map((i) => i.id);
    return this.allIngredients().filter(
      (ing) => !selected.includes(ing.id) && ing.name.toLowerCase().includes(q),
    );
  });

  // ── Suggest ───────────────────────────────────────────────────
  minScore = signal(0);
  results = signal<SuggestResultDTO[]>([]);
  totalResults = signal(0);
  isLoading = signal(false);
  errorMessage = signal('');
  hasSearched = signal(false);

  hasIngredients = computed(() => this.selectedIngredients().length > 0);
  hasResults = computed(() => this.results().length > 0);

  constructor(
    private aiSuggestService: AiSuggestService,
    private ingredientsService: IngredientsService,
    private localizationService: LocalizationService,
  ) {}

  ngOnInit(): void {
    this.loadIngredients();
    this.getCurrentLanguage();
  }
  CurrentLanguage: string = 'en';
    
      private destroy$ = new Subject<void>();
      getCurrentLanguage(): void {
        this.CurrentLanguage = this.localizationService.getCurrentLang();
        this.localizationService.currentLang$.pipe(takeUntil(this.destroy$)).subscribe((lang) => {
          this.CurrentLanguage = lang;
        });
      }
    
      ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
      }

  loadIngredients(): void {
    this.ingredientsLoading.set(true);
    this.ingredientsService.getAll(1, 1000).subscribe({
      next: (res) => {
        // handle different paginated response shapes
        this.allIngredients.set((res as any).items ?? (res as any).data ?? (res as any).results ?? []);
        this.ingredientsLoading.set(false);
      },
      error: () => {
        this.ingredientsLoading.set(false);
      },
    });
  }

  toggleDropdown(): void {
    this.dropdownOpen.update((v) => !v);
    if (this.dropdownOpen()) this.searchQuery.set('');
  }

  closeDropdown(): void {
    this.dropdownOpen.set(false);
  }

  selectIngredient(ing: IngredientInterface): void {
    this.selectedIngredients.update((list) => [...list, ing]);
    this.searchQuery.set('');
  }

  removeIngredient(ing: IngredientInterface): void {
    this.selectedIngredients.update((list) => list.filter((i) => i.id !== ing.id));
  }

  suggest(): void {
    if (!this.hasIngredients()) return;

    this.isLoading.set(true);
    this.errorMessage.set('');
    this.hasSearched.set(false);

    this.aiSuggestService
      .suggest({
        ingredients: this.selectedIngredients().map((i) => i.name),
        minScore: this.minScore(),
      })
      .subscribe({
        next: (res) => {
          this.results.set(res.results);
          this.totalResults.set(res.total_results);
          this.isLoading.set(false);
          this.hasSearched.set(true);
        },
        error: () => {
          this.errorMessage.set('حدث خطأ أثناء الاتصال بالسيرفر، حاول مرة أخرى.');
          this.isLoading.set(false);
        },
      });
  }

  reset(): void {
    this.selectedIngredients.set([]);
    this.minScore.set(0);
    this.results.set([]);
    this.totalResults.set(0);
    this.hasSearched.set(false);
    this.errorMessage.set('');
    this.dropdownOpen.set(false);
  }

  getScoreColor(score: number): string {
    if (score >= 0.75) return 'score-high';
    if (score >= 0.4) return 'score-medium';
    return 'score-low';
  }

  getScorePercent(score: number): number {
    return Math.round(score * 100);
  }

  getIngredientName(item: any): string {
    if (this.CurrentLanguage === 'ar') {
      return item.arabicName || item.name;
    }
    return item.name;
  }
}
