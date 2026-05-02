import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BranchStockService } from '../../../../../Core/Services/BranchStock-Service/branch-stock-service';
import { BranchStockInterface } from '../../../../../Core/Models/BranchStockModels/BranchStockInterface';
import { BranchSelectorComponent } from '../../../../admin/components/BranchStock/branch-selector/branch-selector/branch-selector';
import { Pagination } from '../../../../../Shared/Components/pagination/pagination';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../../Core/Services/Auth-Service/auth-service';
import { SignalRService } from '../../../../../Core/Services/SignalR-Service/SignalrService';
import { TranslatePipe } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { LocalizationService } from '../../../../../Core/Services/Localization-Service/localization-service';

@Component({
  selector: 'app-branch-stock',
  standalone: true,
  imports: [CommonModule, FormsModule, BranchSelectorComponent, Pagination, TranslatePipe],
  templateUrl: './branch-stock.html',
  styleUrl: './branch-stock.scss'
})
export class BranchStockComponent implements OnInit {

  stocks: BranchStockInterface[] = [];
  filteredStocks: BranchStockInterface[] = [];

  loading = true;

  pageIndex = 1;
  pageSize = 10;
  selectedStock?: BranchStockInterface;
  selectedBranchId?: number;
  showModal = false;
  editData = {
    quantityAvailable: 0,
    lowThreshold: 0
  };

  constructor(private service: BranchStockService,
              private authService: AuthService,
              private SignalRService: SignalRService,
              private localizationService: LocalizationService,
  ) {}

  ngOnInit(): void {
    this.loadData();
    this.listenToUpdates();
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

  loadData() {
    this.loading = true;

    this.service.getAll(this.selectedBranchId).subscribe({
      next: (res) => {
        this.stocks = res;
        this.applyPagination();
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  
  listenToUpdates(): void {
      // let token = this.authService.getAccessToken();
      let token =""
      this.SignalRService.startRestaurantUpdatesConnection(token??"");
      this.SignalRService.onRestaurantUpdate("BranchStockUpdated",(data :BranchStockInterface) => {
        debugger
        let index = this.filteredStocks.findIndex(d => d.id === data.id);
        if(index !== -1 && index!==null){
          this.filteredStocks[index] = data;
        }     
      });
    }


  applyPagination() {
    const start = (this.pageIndex - 1) * this.pageSize;
    this.filteredStocks = this.stocks.slice(start, start + this.pageSize);
  }

  onPageChange(page: number) {
    this.pageIndex = page;
    this.applyPagination();
  }

  onBranchChange(branchId: number) {
    this.selectedBranchId = branchId;
    this.pageIndex = 1;
    this.loadData();
  }

  get totalCount() {
    return this.stocks.length;
  }
viewDetails(id: number) {
    this.service.getById(id).subscribe({
      next: (res) => {
        this.selectedStock = res;

        this.editData = {
          quantityAvailable: res.quantityAvailable,
          lowThreshold: res.lowThreshold
        };

        this.showModal = true;
      }
    });
  }
  saveChanges() {
    if (!this.selectedStock) return;

    this.service.update(this.selectedStock.id, this.editData).subscribe({
      next: () => {
        this.closeModal();
        this.loadData(); 
      },
      error: (err) => console.error(err)
    });
  }
  closeModal() {
    this.showModal = false;
    this.selectedStock = undefined;
  }
  getIngredientName(item: any): string {
    if (this.CurrentLanguage === 'ar') {
      return item.ingredientArabicName || item.ingredientName;
    }
    return item.ingredientName;
  }
  getBranchName(item: any): string {
   
    if (this.CurrentLanguage === 'ar') {
      return item.branchArabicName || item.branchName;
    }
    return item.branchName;
  }
}