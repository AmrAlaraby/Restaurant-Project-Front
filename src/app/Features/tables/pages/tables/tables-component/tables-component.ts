import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableService } from '../../../../../Core/Services/Table-Service/table-service';
import { TableInterface } from '../../../../../Core/Models/TableModules/table-interface';
import { CreateTableInterface } from '../../../../../Core/Models/TableModules/create-table-interface';

@Component({
  selector: 'app-tables',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tables-component.html',
  styleUrl: './tables-component.scss'
})
export class TablesComponent implements OnInit {
  tables: TableInterface[] = [];
  filteredTables: TableInterface[] = [];
  isLoading = false;
  errorMessage = '';
  searchTerm = '';
  selectedStatus = '';
  selectedBranchId: number | null = null;
  showAddModal = false;
  newTable: CreateTableInterface = { branchId: 1, tableNumber: '', capacity: 1 };

  constructor(private tableService: TableService) {}

  ngOnInit(): void { this.loadTables(); }

  get availableCount(): number { return this.filteredTables.filter(t => !t.isOccupied).length; }
  get occupiedCount(): number  { return this.filteredTables.filter(t => t.isOccupied).length; }

  loadTables(): void {
    this.isLoading = true;
    this.tableService.getAllTables(
      this.selectedBranchId ?? undefined,
      this.selectedStatus === '' ? undefined : this.selectedStatus === 'occupied'
    ).subscribe({
      next: (res) => {
        this.tables = res;
        this.applyFilters();
        this.isLoading = false;
      },
      error: () => { this.errorMessage = 'Failed to load tables'; this.isLoading = false; }
    });
  }

  applyFilters(): void {
    this.filteredTables = this.tables.filter(t => {
      const matchSearch = this.searchTerm === '' || t.tableNumber.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchStatus = this.selectedStatus === '' ||
        (this.selectedStatus === 'occupied' && t.isOccupied) ||
        (this.selectedStatus === 'available' && !t.isOccupied);
      return matchSearch && matchStatus;
    });
  }

  filterByBranch(branchId: number | null): void {
    this.selectedBranchId = branchId;
    this.loadTables();
  }

  toggleStatus(table: TableInterface): void {
    this.tableService.updateTableStatus(table.id, { isOccupied: !table.isOccupied }).subscribe({
      next: () => this.loadTables(),
      error: () => this.errorMessage = 'Failed to update status'
    });
  }

  deleteTable(id: number): void {
    this.tableService.deleteTable(id).subscribe({
      next: () => this.loadTables(),
      error: () => this.errorMessage = 'Cannot delete occupied table'
    });
  }

  openAddModal(): void { this.showAddModal = true; }
  closeAddModal(): void {
    this.showAddModal = false;
    this.newTable = { branchId: 1, tableNumber: '', capacity: 1 };
  }

  submitAddTable(): void {
    this.tableService.createTable(this.newTable).subscribe({
      next: () => { this.closeAddModal(); this.loadTables(); },
      error: () => this.errorMessage = 'Failed to create table'
    });
  }
}
