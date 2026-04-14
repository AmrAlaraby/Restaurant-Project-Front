import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BranchStockService } from '../../../../../Core/Services/BranchStock-Service/branch-stock-service';
import { BranchStockInterface } from '../../../../../Core/Models/BranchStockModels/BranchStockInterface';
import { BranchSelectorComponent } from '../../../../admin/components/BranchStock/branch-selector/branch-selector/branch-selector';
import { Pagination } from '../../../../../Shared/Components/pagination/pagination';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-branch-stock',
  standalone: true,
  imports: [CommonModule, FormsModule, BranchSelectorComponent, Pagination],
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

  constructor(private service: BranchStockService) {}

  ngOnInit(): void {
    this.loadData();
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
}