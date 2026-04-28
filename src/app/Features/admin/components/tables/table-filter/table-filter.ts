import { Component, Output, EventEmitter, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, takeUntil } from 'rxjs';
import { BranchService } from '../../../../../Core/Services/Branch-Service/branch-service';
import { Branch } from '../../../../../Core/Models/BranchModels/branch-interface';
import { TranslatePipe } from '@ngx-translate/core';
import { LocalizationService } from '../../../../../Core/Services/Localization-Service/localization-service';


@Component({
  selector: 'app-table-filter',
  standalone: true,
  imports: [FormsModule,TranslatePipe],
  templateUrl: './table-filter.html',
  styleUrls: ['./table-filter.scss'],
})
export class TableFilter implements OnInit, OnDestroy {
  private branchService = inject(BranchService);

  branches: Branch[] = [];
  search: string = '';
  branchId: number | null = null;
  isOccupied: boolean | null = null;

  private filterSubject = new Subject<string>();

  @Output() filterChanged = new EventEmitter<{
    branchId?: number;
    isOccupied?: boolean;
    search?: string;
  }>();

  ngOnInit(): void {
    this.branchService.getBranches().subscribe({
      next: (res) => (this.branches = res),
      error: (err) => console.error(err),
    });

    this.filterSubject.pipe(debounceTime(1000)).subscribe(() => this.emitFilters());
    this.getCurrentLanguage();
  }

  constructor(private localizationService: LocalizationService) {}
    CurrentLanguage: string = 'en';
  
    private destroy$ = new Subject<void>();
      getCurrentLanguage(): void {
        this.CurrentLanguage = this.localizationService.getCurrentLang();
        this.localizationService.currentLang$
      .pipe(takeUntil(this.destroy$))
      .subscribe(lang => {
        this.CurrentLanguage = lang;
      });
      }


  onSearchChange(value: string) {
    this.search = value;
    this.filterSubject.next(value);
  }

  onFilterChange() {
    this.emitFilters();
  }

  emitFilters() {
    this.filterChanged.emit({
      branchId: this.branchId ?? undefined,
      isOccupied: this.isOccupied ?? undefined,
      search: this.search || undefined,
    });
  }

  resetFilters() {
    this.branchId = null;
    this.isOccupied = null;
    this.emitFilters();
  }

  ngOnDestroy(): void {
    this.filterSubject.complete();
    this.destroy$.next();
      this.destroy$.complete();
  }

  getBranchName(item: any): string {
    if (this.CurrentLanguage === 'ar') {
     return item.arabicName || item.name;
    }
    return item.name;
  }
}
