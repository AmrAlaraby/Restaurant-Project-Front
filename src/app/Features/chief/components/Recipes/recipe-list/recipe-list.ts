import { Component, OnInit, inject, signal, computed, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MenuItemInterface } from '../../../../../Core/Models/MenuItemModels/menu-item-interface';
import { RecipesListDTO } from '../../../../../Core/Models/RecipeModels/recipes-list-dto';
import { MenuItemsService } from '../../../../../Core/Services/Menu-Item-Service/menu-item-service';
import { RecipesService } from '../../../../../Core/Services/Recipe-Service/recipes-service';
import { Pagination } from '../../../../../Shared/Components/pagination/pagination';

@Component({
  selector: 'app-recipes',
  standalone: true,
  imports: [CommonModule, FormsModule, Pagination],
  templateUrl: './recipe-list.html',
  styleUrls: ['./recipe-list.scss'],
})
export class RecipeListComponent implements OnInit {
  private readonly recipesService   = inject(RecipesService);
  private readonly menuItemsService = inject(MenuItemsService);

  // ── Outputs ──────────────────────────────────────────────────
  editRequested = output<RecipesListDTO>();

  // ── State ────────────────────────────────────────────────────
  recipes            = signal<RecipesListDTO[]>([]);
  menuItems          = signal<MenuItemInterface[]>([]);
  count              = signal(0);
  pageIndex          = signal(1);
  pageSize           = signal(5);
  selectedMenuItemId = signal<number | undefined>(undefined);
  isLoading          = signal(false);
  error              = signal<string | null>(null);
  deletingId         = signal<number | null>(null);

  // ── Accordion ────────────────────────────────────────────────
  private openGroups = signal<Set<string>>(new Set());

  toggleGroup(menuItem: string): void {
    const current = new Set(this.openGroups());
    if (current.has(menuItem)) {
      current.delete(menuItem);
    } else {
      current.add(menuItem);
    }
    this.openGroups.set(current);
  }

  isGroupOpen(menuItem: string): boolean {
    return this.openGroups().has(menuItem);
  }

  // ── Derived ──────────────────────────────────────────────────
  groupedRecipes = computed(() => {
    const map = new Map<string, RecipesListDTO[]>();
    for (const r of this.recipes()) {
      if (!map.has(r.menuItemName)) map.set(r.menuItemName, []);
      map.get(r.menuItemName)!.push(r);
    }
    return map;
  });

  menuItemNames = computed(() => [...this.groupedRecipes().keys()]);

  // ── Lifecycle ────────────────────────────────────────────────
  ngOnInit(): void {
    this.loadMenuItems();
    this.loadRecipes();
  }

  // ── Data ─────────────────────────────────────────────────────
  loadMenuItems(): void {
    this.menuItemsService
      .getAll({ pageSize: 100 })
      .subscribe({ next: (res) => this.menuItems.set(res.data) });
  }

  loadRecipes(): void {
    this.isLoading.set(true);
    this.error.set(null);
    // Reset open groups when data reloads
    this.openGroups.set(new Set());

    this.recipesService
      .getRecipes({
        menuItemId: this.selectedMenuItemId(),
        pageIndex:  this.pageIndex(),
        pageSize:   this.pageSize(),
      })
      .subscribe({
        next: (result) => {
          this.recipes.set(result.data);
          this.count.set(result.count);
          this.isLoading.set(false);
        },
        error: () => {
          this.error.set('Failed to load recipes. Please try again.');
          this.isLoading.set(false);
        },
      });
  }

  // ── Events ───────────────────────────────────────────────────
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

  // ── Helpers ──────────────────────────────────────────────────
  getMenuItemIcon(name: string): string {
    const n = name.toLowerCase();
    if (n.includes('pizza'))                        return '🍕';
    if (n.includes('grill') || n.includes('meat'))  return '🍖';
    if (n.includes('salad'))                        return '🥗';
    if (n.includes('burger'))                       return '🍔';
    if (n.includes('pasta'))                        return '🍝';
    return '🍽️';
  }
}
