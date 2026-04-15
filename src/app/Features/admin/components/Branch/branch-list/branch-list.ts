import { Component, inject, OnInit, signal, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BranchQueryParams } from '../../../../../Core/Models/BranchModels/branch-query-params';
import { GetBranch } from '../../../../../Core/Models/BranchModels/get-branch';
import { BranchService } from '../../../../../Core/Services/Branch-Service/branch-service';
import { Pagination } from '../../../../../Shared/Components/pagination/pagination';


@Component({
  selector: 'app-branch-list',
  standalone: true,
  imports: [CommonModule, RouterModule, Pagination],
  templateUrl: './branch-list.html',
  styleUrls: ['./branch-list.scss'],
})
export class BranchListComponent implements OnInit, OnChanges {
  private branchService = inject(BranchService);

  @Input() selectedBranchId: number | null = null;
  @Input() refreshTrigger: number = 0;
  @Output() branchSelected = new EventEmitter<number>();
  @Output() createRequested = new EventEmitter<void>();

  branches = signal<GetBranch[]>([]);
  totalCount = signal(0);
  isLoading = signal(false);
  error = signal<string | null>(null);

  params: BranchQueryParams = {
    pageIndex: 1,
    pageSize: 5,
  };

  ngOnInit(): void {
    this.loadBranches();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['refreshTrigger'] && !changes['refreshTrigger'].firstChange) {
      this.loadBranches();
    }
  }

  loadBranches(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.branchService.getAllWithTables(this.params).subscribe({
      next: (result) => {
        this.branches.set(result.data);
        this.totalCount.set(result.count);
        this.isLoading.set(false);
      },
      error: () => {
        this.error.set('Failed to load branches. Please try again.');
        this.isLoading.set(false);
      },
    });
  }

  onPageChanged(page: number): void {
    this.params = { ...this.params, pageIndex: page };
    this.loadBranches();
  }

  selectBranch(id: number): void {
    this.branchSelected.emit(id);
  }

  openCreate(): void {
    this.createRequested.emit();
  }

  getAddress(branch: GetBranch): string {
    return `${branch.buildingNumber} ${branch.street}, ${branch.city}`;
  }
}
