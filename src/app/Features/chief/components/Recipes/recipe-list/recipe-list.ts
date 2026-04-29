import { Component, OnInit, OnDestroy, inject, signal, computed, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MenuItemInterface } from '../../../../../Core/Models/MenuItemModels/menu-item-interface';
import { RecipesListDTO } from '../../../../../Core/Models/RecipeModels/recipes-list-dto';
import { MenuItemsService } from '../../../../../Core/Services/Menu-Item-Service/menu-item-service';
import { RecipesService } from '../../../../../Core/Services/Recipe-Service/recipes-service';
import { Pagination } from '../../../../../Shared/Components/pagination/pagination';
import { TranslatePipe } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { LocalizationService } from '../../../../../Core/Services/Localization-Service/localization-service';

@Component({
  selector: 'app-recipes',
  standalone: true,
  imports: [CommonModule, FormsModule, Pagination, TranslatePipe],
  templateUrl: './recipe-list.html',
  styleUrls: ['./recipe-list.scss'],
})
export class RecipeListComponent implements OnInit, OnDestroy {
  private readonly recipesService = inject(RecipesService);
  private readonly menuItemsService = inject(MenuItemsService);

  editRequested = output<RecipesListDTO>();

  recipes = signal<RecipesListDTO[]>([]);
  menuItems = signal<MenuItemInterface[]>([]);
  count = signal(0);
  pageIndex = signal(1);
  pageSize = signal(5);
  selectedMenuItemId = signal<number | undefined>(undefined);
  isLoading = signal(false);
  error = signal<string | null>(null);
  deletingId = signal<number | null>(null);

  private openGroups = signal<Set<string>>(new Set());

  constructor(private localizationService: LocalizationService) {}

  CurrentLanguage: string = 'en';
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.loadMenuItems();
    this.loadRecipes();
    this.getCurrentLanguage();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getCurrentLanguage(): void {
    this.CurrentLanguage = this.localizationService.getCurrentLang();

    this.localizationService.currentLang$
      .pipe(takeUntil(this.destroy$))
      .subscribe((lang) => {
        this.CurrentLanguage = lang;
      });
  }

  // 🔥 أهم تعديل هنا
  groupedRecipes = computed(() => {
    const map = new Map<string, RecipesListDTO[]>();

    for (const r of this.recipes()) {
      const key =
        this.CurrentLanguage === 'ar'
          ? r.menuItemArabicName || r.menuItemName
          : r.menuItemName;

      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(r);
    }

    return map;
  });

  menuItemNames = computed(() => [...this.groupedRecipes().keys()]);

  toggleGroup(menuItem: string): void {
    const current = new Set(this.openGroups());
    current.has(menuItem) ? current.delete(menuItem) : current.add(menuItem);
    this.openGroups.set(current);
  }

  isGroupOpen(menuItem: string): boolean {
    return this.openGroups().has(menuItem);
  }

  loadMenuItems(): void {
    this.menuItemsService
      .getAll({ pageSize: 100 })
      .subscribe({ next: (res) => this.menuItems.set(res.data) });
  }

  loadRecipes(): void {
    this.isLoading.set(true);
    this.error.set(null);
    this.openGroups.set(new Set());

    this.recipesService
      .getRecipes({
        menuItemId: this.selectedMenuItemId(),
        pageIndex: this.pageIndex(),
        pageSize: this.pageSize(),
      })
      .subscribe({
        next: (result) => {
          this.recipes.set(result.data);
          this.count.set(result.count);
          this.isLoading.set(false);
        },
        error: () => {
          this.error.set('CHEF.RECIPES.LIST.ERROR');
          this.isLoading.set(false);
        },
      });
  }

  onMenuItemSelected(value: string): void {
    this.selectedMenuItemId.set(value ? Number(value) : undefined);
    this.pageIndex.set(1);
    this.loadRecipes();
  }

  onPageChanged(page: number): void {
    this.pageIndex.set(page);
    this.loadRecipes();
  }

  onEditClick(recipe: RecipesListDTO): void {
    this.editRequested.emit(recipe);
  }

  onDeleteClick(id: number): void {
    if (!confirm('Are you sure you want to delete this recipe?')) return;

    this.deletingId.set(id);

    this.recipesService.deleteRecipe(id).subscribe({
      next: () => {
        this.deletingId.set(null);
        this.loadRecipes();
      },
      error: () => {
        this.deletingId.set(null);
      },
    });
  }

  getMenuItemIcon(name: string): string {
    const n = name.toLowerCase();
    if (n.includes('pizza')) return '🍕';
    if (n.includes('grill') || n.includes('meat')) return '🍖';
    if (n.includes('salad')) return '🥗';
    if (n.includes('burger')) return '🍔';
    if (n.includes('pasta')) return '🍝';
    return '🍽️';
  }

  getIngredientName(item: any): string {
    return this.CurrentLanguage === 'ar'
      ? item.ingredientArabicName || item.ingredientName
      : item.ingredientName;
  }

  getItemName(item: any): string {
    return this.CurrentLanguage === 'ar'
      ? item.arabicName || item.name
      : item.name;
  }

  getMenuItemDisplayName(menuItem: string): string {
  const recipes = this.groupedRecipes().get(menuItem);
  if (!recipes || recipes.length === 0) return menuItem;

  const first = recipes[0];

  return this.CurrentLanguage === 'ar'
    ? first.menuItemArabicName || first.menuItemName
    : first.menuItemName;
}
}