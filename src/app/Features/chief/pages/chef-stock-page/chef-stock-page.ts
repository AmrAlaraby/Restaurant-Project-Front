import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChefLowStockComponent } from '../../components/chef-kitchen/chef-low-stock/chef-low-stock';
import { ChefAvailableStockComponent } from '../../components/chef-kitchen/chef-available-stock/chef-available-stock';
import { BranchStockInterface } from '../../../../Core/Models/BranchStockModels/BranchStockInterface';
import { AuthService } from '../../../../Core/Services/Auth-Service/auth-service';
import { BranchStockService } from '../../../../Core/Services/BranchStock-Service/branch-stock-service';
import { SignalRService } from '../../../../Core/Services/SignalR-Service/SignalrService';



@Component({
  selector: 'app-chef-stock-page',
  standalone: true,
  imports: [CommonModule, ChefLowStockComponent, ChefAvailableStockComponent],
  templateUrl: './chef-stock-page.html',
  styleUrl: './chef-stock-page.scss'
})
export class ChefStockPageComponent implements OnInit {

  allStocks: BranchStockInterface[] = [];
  loading = true;

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

  get lowStocks(): BranchStockInterface[] {
    return this.allStocks.filter(s => s.quantityAvailable <= s.lowThreshold);
  }

  get availableStocks(): BranchStockInterface[] {
    return this.allStocks.filter(s => s.quantityAvailable > s.lowThreshold);
  }
}
