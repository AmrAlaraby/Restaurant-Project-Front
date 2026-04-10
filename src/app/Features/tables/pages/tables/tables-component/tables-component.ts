import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableInterface } from '../../../../../Core/Models/TableModules/table-interface';
import { TableService } from '../../../../../Core/Services/Table-Service/table-service';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-tables',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './tables-component.html',
  styleUrls: ['./tables-component.scss']
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
        console.log(err)


      }
    });
  }

  updateStatus(id: number, isOccupied: boolean): void {
    this.tableService.updateTableStatus(id, { isOccupied }).subscribe({
      next: () => this.loadTables(),
      error: (err) => this.errorMessage = 'Failed to update status'
    });
  }

  deleteTable(id: number): void {
    this.tableService.deleteTable(id).subscribe({
      next: () => this.loadTables(),
      error: (err) => this.errorMessage = 'Failed to delete table'
    });
  }
  get occupiedCount(): number {
  return this.tables.filter(t => t.isOccupied).length;
}

get availableCount(): number {
  return this.tables.filter(t => !t.isOccupied).length;
}
showAddModal = false;
newTable = {
  branchId: 1,
  tableNumber: '',
  capacity: 1
};

openAddModal(): void {
  console.log('clicked');
  this.showAddModal = true;

  setTimeout(() => {
    console.log('modal state:', this.showAddModal);
  }, 1000);
}


closeAddModal(): void {
  this.showAddModal = false;
  this.newTable = { branchId: 1, tableNumber: '', capacity: 1 };
}

submitAddTable(): void {
  this.tableService.createTable(this.newTable).subscribe({
    next: () => {
      this.loadTables();
      this.closeAddModal();
    },
    error: () => this.errorMessage = 'Failed to create table'
  });
  }
  selectedStatus: boolean | null = null;

filterByStatus(status: boolean | null): void {
  this.selectedStatus = status;
  this.tableService.getAllTables(undefined, status ?? undefined).subscribe({
    next: (res) => this.tables = res,
    error: () => this.errorMessage = 'Failed to filter tables'
  });
}
  
}
