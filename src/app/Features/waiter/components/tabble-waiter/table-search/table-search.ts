import { Component, Output, EventEmitter, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime } from 'rxjs';
import { BranchService } from '../../../../../Core/Services/Branch-Service/branch-service';
import { Branch } from '../../../../../Core/Models/BranchModels/branch-interface';
import { TranslatePipe } from '@ngx-translate/core';




@Component({
  selector: 'app-table-search',
  standalone: true,
  imports: [FormsModule,TranslatePipe],
  templateUrl: './table-search.html',
  styleUrls: ['./table-search.scss'],
})
export class TableSearch implements OnInit, OnDestroy {
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
  }
}
