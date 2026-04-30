import { MenuItemsStatsInterface } from './../../../../Core/Models/MenuItemModels/menu-items-stats-interface';
import { BranchService } from './../../../../Core/Services/Branch-Service/branch-service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CategoryInterface } from '../../../../Core/Models/MenuItemModels/category-interface';
import { MenuItemDetailsInterface } from '../../../../Core/Models/MenuItemModels/menu-item-details-interface';
import { MenuItemInterface } from '../../../../Core/Models/MenuItemModels/menu-item-interface';
import { MenuItemQueryParamsInterface } from '../../../../Core/Models/MenuItemModels/menu-item-query-params-interface';
import { CategoryService } from '../../../../Core/Services/Categories-Service/categories-service';
import { MenuItemsService } from '../../../../Core/Services/Menu-Item-Service/menu-item-service';
import { Pagination } from '../../../../Shared/Components/pagination/pagination';
import { MenuItemDetails } from '../../components/MenuItem/menu-item-details/menu-item-details';
import { MenuItemForm } from '../../components/MenuItem/menu-item-form/menu-item-form';
import { MenuItemsFilters } from '../../components/MenuItem/menu-items-filters/menu-items-filters';
import { MenuItemsGrid } from '../../components/MenuItem/menu-items-grid/menu-items-grid';
import { MenuItemsStats } from '../../components/MenuItem/menu-items-stats/menu-items-stats';
import { Branch } from '../../../../Core/Models/BranchModels/branch-interface';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-menu-items-page',
  standalone: true,
  imports: [
    CommonModule,
    MenuItemsStats,
    MenuItemsFilters,
    MenuItemsGrid,
    Pagination,
    MenuItemForm,
    MenuItemDetails,
    TranslatePipe
  ],
  templateUrl: './menu-items-page.html',
  styleUrls: ['./menu-items-page.scss'],
})
export class MenuItemsPage implements OnInit {
  menuItems: MenuItemInterface[] = [];
  categories: CategoryInterface[] = [];
  branches: Branch[] = [];

  showFormModal = false;
  selectedMenuItemId?: number;

  showDeleteModal = false;
  selectedDeleteId?: number;

  showDetailsModal = false;
  selectedMenuItemDetails?: MenuItemDetailsInterface;

  isEditMode = false;

  loading = false;
  totalCount = 0;

  filters: MenuItemQueryParamsInterface = {
    pageIndex: 1,
    pageSize: 15,
  };

  stats: MenuItemsStatsInterface = {
    totalItems: 0,
    availableItems: 0,
    unavailableItems: 0,
  };

  constructor(
    private menuItemsService: MenuItemsService,
    private categoriesService: CategoryService,
    private BranchService: BranchService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadCategories();
    this.loadBranches();
    this.loadMenuItems();
    this.loadStats();
  }

  // ================= LOAD DATA =================
  loadMenuItems(): void {
    this.loading = true;

    this.menuItemsService.getAll(this.filters).subscribe({
      next: (response) => {
        this.menuItems = response.data;
        this.totalCount = response.count;

        this.calculateStats();
        this.loading = false;
      },
      error: (error) => {
        console.error(error);
        this.loading = false;
      },
    });
  }

  loadCategories(): void {
    this.categoriesService.getAll().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
    });
  }

  loadBranches(): void {
    this.BranchService.getBranches().subscribe({
      next: (branches) => {
        this.branches = branches;
      },
    });
  }

  loadStats(): void {
    this.menuItemsService.getStats().subscribe({
      next: (res) => {
        this.stats = res;
      },
    });
  }

  calculateStats(): void {
    const availableItems = this.menuItems.filter((item) => item.isAvailable).length;
    const totalPrice = this.menuItems.reduce((sum, item) => sum + item.price, 0);
  }

  // ================= FILTER =================
  onFiltersChanged(filters: MenuItemQueryParamsInterface): void {
    this.filters = {
      ...this.filters,
      ...filters,
      pageIndex: 1,
      pageSize: this.filters.pageSize,
    };

    this.loadMenuItems();
    this.loadStats();
  }

  resetFilters(): void {
    this.filters = {
      pageIndex: 1,
      pageSize: 15,
    };

    this.loadMenuItems();
  }

  onPageChanged(page: number): void {
    this.filters.pageIndex = page;
    this.loadMenuItems();
  }
  handleFormSubmitted(): void {
    this.showFormModal = false;
    this.loadMenuItems();
  }
  // ================= MODALS CONTROL =================

  
  closeAllModals(): void {
    this.showFormModal = false;
    this.showDeleteModal = false;
    this.showDetailsModal = false;
  }

  // ================= OPEN =================
  onAddNew(): void {
    this.closeAllModals();
    this.selectedMenuItemId = undefined;
    this.isEditMode = false;
    this.showFormModal = true;
  }

  onEdit(id: number): void {
    this.closeAllModals();
    this.selectedMenuItemId = id;
    this.isEditMode = true;
    this.showFormModal = true;
  }

  onView(id: number): void {
    this.closeAllModals();
    this.menuItemsService.getById(id).subscribe({
      next: (menuItem) => {
        this.selectedMenuItemDetails = menuItem;
        this.showDetailsModal = true;
      },
    });
  }

  onDelete(id: number): void {
    this.closeAllModals(); 
    this.selectedDeleteId = id;
    this.showDeleteModal = true;
  }

  onToggleAvailability(id: number): void {
    this.menuItemsService.toggleAvailability(id).subscribe({
      next: () => {
        this.loadMenuItems();
        this.loadStats();
      },
    });
  }

  // ================= CLOSE =================
  closeFormModal(): void {
    this.showFormModal = false;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.selectedDeleteId = undefined;
  }

  confirmDelete(): void {
    if (!this.selectedDeleteId) return;

    this.menuItemsService.delete(this.selectedDeleteId).subscribe({
      next: () => {
        this.closeDeleteModal();
        this.loadMenuItems();
      },
    });
  }

  closeDetailsModal(): void {
    this.showDetailsModal = false;
    this.selectedMenuItemDetails = undefined;
  }

  // ================= UTIL =================
  isAnyModalOpen(): boolean {
    return this.showFormModal || this.showDeleteModal || this.showDetailsModal;
  }
}