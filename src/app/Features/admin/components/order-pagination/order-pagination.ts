import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-order-pagination',
  imports: [],
  templateUrl: './order-pagination.html',
  styleUrl: './order-pagination.scss',
})
export class OrderPagination implements OnChanges{
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['total'] || changes['pageSize']) {
      this.showNext = this.pageIndex < this.totalPages;
      this.showPrev = this.pageIndex > 1;
    }
  }

  @Input() total = 0;
  @Input() pageSize = 10;
  @Input() pageIndex = 1;
   get totalPages() {
    return Math.ceil(this.total / this.pageSize);
  }

  @Output() pageChange = new EventEmitter<number>();


  showNext = true;
  showPrev = false;
  

  next() {
    if (this.pageIndex < this.totalPages) {
    this.pageIndex++;
    this.pageChange.emit(this.pageIndex);
    if (this.pageIndex >= this.totalPages) {
      this.showNext = false;    
    }
    if (this.pageIndex > 1) {
      this.showPrev = true;    
    }
  }
  }

  prev() {
    if (this.pageIndex > 1) {
      this.pageIndex--;
      this.pageChange.emit(this.pageIndex);
      if (this.pageIndex <= 1) {
        this.showPrev = false;    
      }
      if (this.pageIndex < this.totalPages) {
        this.showNext = true;    
      }
    }
  }
}
