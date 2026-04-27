import { Component, EventEmitter, Input, Output } from '@angular/core';

import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';


@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './pagination.html',
  styleUrls: ['./pagination.scss'],
})
export class Pagination {
  @Input()
  pageIndex = 1;

  @Input()
  pageSize = 10;

  @Input()
  totalCount = 0;

  @Output()
  pageChanged = new EventEmitter<number>();

  get totalPages(): number {
    return Math.ceil(this.totalCount / this.pageSize);
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages || page === this.pageIndex) {
      return;
    }

    this.pageChanged.emit(page);
  }
}
