import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableInterface } from '../../../../../Core/Models/TableModules/table-interface';
import { TableService } from '../../../../../Core/Services/Table-Service/table-service';
import { Pagination } from '../../../../../Shared/Components/pagination/pagination';


@Component({
  selector: 'app-tables',
  standalone: true,
  imports: [CommonModule, Pagination],
  templateUrl: './tables-component.html',
  styleUrls: ['./tables-component.scss'],
})
export class TablesComponent implements OnInit {
  tables: TableInterface[] = [];
  isLoading = false;
  errorMessage = '';

  constructor(private tableService: TableService) {}

  ngOnInit(): void {
    this.loadTables();
  }

  loadTables(): void {
    this.isLoading = true;
    this.tableService.getAllTables().subscribe({
      next: (res) => {
        this.tables = res;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load tables';
        this.isLoading = false;
        console.log(err);
      },
    });
  }

  updateStatus(id: number, isOccupied: boolean): void {
    this.tableService.updateTableStatus(id, { isOccupied }).subscribe({
      next: () => this.loadTables(),
      error: (err) => (this.errorMessage = 'Failed to update status'),
    });
  }

  deleteTable(id: number): void {
    this.tableService.deleteTable(id).subscribe({
      next: () => this.loadTables(),
      error: (err) => (this.errorMessage = 'Failed to delete table'),
    });
  }
  get occupiedCount(): number {
    return this.tables.filter((t) => t.isOccupied).length;
  }

  get availableCount(): number {
    return this.tables.filter((t) => !t.isOccupied).length;
  }

  pageIndex = 1;
  pageSize = 10;
  totalCount = 47;

  handlePageChange(page: number): void {
    this.pageIndex = page;

    console.log('Page Changed:', page);
  }
}
