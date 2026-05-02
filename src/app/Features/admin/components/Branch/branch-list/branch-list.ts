import { Component, inject, OnInit, OnChanges, SimpleChanges, signal, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BranchQueryParams } from '../../../../../Core/Models/BranchModels/branch-query-params';
import { GetBranch } from '../../../../../Core/Models/BranchModels/get-branch';
import { BranchService } from '../../../../../Core/Services/Branch-Service/branch-service';
import { Pagination } from '../../../../../Shared/Components/pagination/pagination';
import { ToastService } from '../../../../../Core/Services/Toast-Service/toast-service';
import { TranslatePipe } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { LocalizationService } from '../../../../../Core/Services/Localization-Service/localization-service';

@Component({
  selector: 'app-branch-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, Pagination, TranslatePipe],
  templateUrl: './branch-list.html',
  styleUrls: ['./branch-list.scss'],
})
export class BranchListComponent implements OnInit, OnChanges {
  private branchService = inject(BranchService);
 private toast         = inject(ToastService);
  @Input() selectedBranchId: number | null = null;
  @Input() refreshTrigger: number = 0;
  @Output() branchSelected = new EventEmitter<number>();
  @Output() createRequested = new EventEmitter<void>();

  branches = signal<GetBranch[]>([]);
  totalCount = signal(0);
  isLoading = signal(false);
  error = signal<string | null>(null);

  searchTerm = '';
  private searchTimeout: any;

  params: BranchQueryParams = {
    pageIndex: 1,
    pageSize: 5,
  };

  constructor(
        private localizationService: LocalizationService,
      ) {}

  ngOnInit(): void {
    this.loadBranches();
    this.getCurrentLanguage();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['refreshTrigger'] && !changes['refreshTrigger'].firstChange) {
      this.loadBranches();
    }
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

  onSearchChange(): void {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.params = { ...this.params, search: this.searchTerm, pageIndex: 1 };
      this.loadBranches();
    }, 400);
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

  getItemName(item: any): string {
    if (this.CurrentLanguage === 'ar') {
      return item.arabicName || item.name;
    }
    return item.name;
  }
}
