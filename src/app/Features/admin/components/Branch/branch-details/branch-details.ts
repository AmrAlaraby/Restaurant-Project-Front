import { Component, inject, OnInit, OnChanges, SimpleChanges, signal, computed, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BranchStock } from '../../../../../Core/Models/BranchModels/branch-stock';
import { GetBranch } from '../../../../../Core/Models/BranchModels/get-branch';
import { BranchService } from '../../../../../Core/Services/Branch-Service/branch-service';
import { ConfirmDeleteComponent } from '../confirm-delete/confirm-delete';


@Component({
  selector: 'app-branch-details',
  standalone: true,
  imports: [CommonModule, RouterModule, ConfirmDeleteComponent],
  templateUrl: './branch-details.html',
  styleUrls: ['./branch-details.scss'],
})
export class BranchDetailsComponent implements OnInit, OnChanges {
  private branchService = inject(BranchService);

  @Input({ required: true }) branchId!: number;
  @Output() closed = new EventEmitter<void>();
  @Output() editRequested = new EventEmitter<void>();
  @Output() deleted = new EventEmitter<void>();

  branch = signal<GetBranch | null>(null);
  isLoading = signal(false);
  error = signal<string | null>(null);
  activeTab = signal<'tables' | 'staff' | 'stock'>('tables');
  showDeleteConfirm = signal(false);

  occupiedTables = computed(() =>
    this.branch()?.tables.filter((t) => t.isOccupied).length ?? 0
  );

  ngOnInit(): void {
    this.loadBranch();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['branchId'] && !changes['branchId'].firstChange) {
      this.loadBranch();
    }
  }

  loadBranch(): void {
    if (!this.branchId) return;

    this.isLoading.set(true);
    this.error.set(null);
    this.activeTab.set('tables');

    this.branchService.getById(this.branchId).subscribe({
      next: (result) => {
        this.branch.set(result);
        this.isLoading.set(false);
      },
      error: () => {
        this.error.set('Failed to load branch details. Please try again.');
        this.isLoading.set(false);
      },
    });
  }

  setTab(tab: 'tables' | 'staff' | 'stock'): void {
    this.activeTab.set(tab);
  }

  close(): void {
    this.closed.emit();
  }

  openEdit(): void {
    this.editRequested.emit();
  }

  toggleStatus(): void {
    const b = this.branch();
    if (!b) return;
    this.branchService.toggleStatus(b.id).subscribe({
      next: () => this.loadBranch(),
      error: () => this.error.set('Failed to toggle branch status.'),
    });
  }

  openDeleteConfirm(): void {
    this.showDeleteConfirm.set(true);
  }

  onDeleteCancelled(): void {
    this.showDeleteConfirm.set(false);
  }

  onDeleteConfirmed(): void {
    this.showDeleteConfirm.set(false);
    this.deleted.emit();
    this.closed.emit();
  }

  getAddress(): string {
    const b = this.branch();
    if (!b) return '';
    return `${b.buildingNumber} ${b.street}, ${b.city}`;
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  isLowStock(stock: BranchStock): boolean {
    return stock.quantityAvailable <= stock.lowThreshold;
  }

  getStockPercent(stock: BranchStock): number {
    const max = stock.lowThreshold * 10;
    return Math.min((stock.quantityAvailable / max) * 100, 100);
  }
}
