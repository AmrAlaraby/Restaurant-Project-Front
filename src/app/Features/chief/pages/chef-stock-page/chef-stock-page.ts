import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChefLowStockComponent } from '../../components/chef-kitchen/chef-low-stock/chef-low-stock';
import { ChefAvailableStockComponent } from '../../components/chef-kitchen/chef-available-stock/chef-available-stock';
import { BranchStockInterface } from '../../../../Core/Models/BranchStockModels/BranchStockInterface';
import { AuthService } from '../../../../Core/Services/Auth-Service/auth-service';
import { BranchStockService } from '../../../../Core/Services/BranchStock-Service/branch-stock-service';
import { SignalRService } from '../../../../Core/Services/SignalR-Service/SignalrService';
import { TranslatePipe } from '@ngx-translate/core';



@Component({
  selector: 'app-chef-stock-page',
  standalone: true,
  imports: [CommonModule, FormsModule, ChefLowStockComponent, ChefAvailableStockComponent, TranslatePipe],
  templateUrl: './chef-stock-page.html',
  styleUrl: './chef-stock-page.scss'
})
export class ChefStockPageComponent implements OnInit {

  allStocks: BranchStockInterface[] = [];
  loading = true;
  searchTerm = '';

  constructor(
    private service:        BranchStockService,
    private authService:    AuthService,
    private signalRService: SignalRService
  ) {}

  ngOnInit(): void {
    // 1. get current user → extract branchId → load stock for that branch only
    this.authService.getCurrentUser().subscribe({
      next: (user) => {
        this.loadStock(user.branchId);
        this.listenToUpdates();
      },
      error: () => (this.loading = false)
    });
  }

  loadStock(branchId: number): void {
    this.loading = true;
    this.service.getAll(branchId).subscribe({
      next:  (res) => { this.allStocks = res; this.loading = false; },
      error: ()    => { this.loading = false; }
    });
  }

  listenToUpdates(): void {
    const token = this.authService.getAccessToken();
    this.signalRService.startRestaurantUpdatesConnection(token ?? '');
    this.signalRService.onRestaurantUpdate(
      'BranchStockUpdated',
      (data: BranchStockInterface) => {
        const index = this.allStocks.findIndex(s => s.id === data.id);
        if (index !== -1) this.allStocks[index] = data;
      }
    );
  }

  private get filteredStocks(): BranchStockInterface[] {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) return this.allStocks;
    return this.allStocks.filter(s =>
      s.ingredientName?.toLowerCase().includes(term) ?? false
    );
  }

  get lowStocks(): BranchStockInterface[] {
    return this.filteredStocks.filter(s => s.quantityAvailable <= s.lowThreshold);
  }

  get availableStocks(): BranchStockInterface[] {
    return this.filteredStocks.filter(s => s.quantityAvailable > s.lowThreshold);
  }
}
