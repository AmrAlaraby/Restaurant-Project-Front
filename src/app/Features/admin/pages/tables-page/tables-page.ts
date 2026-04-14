import { Component, OnInit, inject } from '@angular/core';
import { TableService } from '../../../../Core/Services/Table-Service/table-service';
import { Pagination } from '../../../../Shared/Components/pagination/pagination';
import { TableInterface } from '../../../../Core/Models/TableModels/table-interface';
import { TableCard } from '../../components/tables/table-card/table-card';
import { ConfirmationModal } from '../../components/tables/confirmation-modal/confirmation-modal';
import { TableOrdersService } from '../../../../Core/Services/Table-Order-Service/table-orders.service';
import { OrderDetailsModal } from '../../components/tables/order-details-modal/order-details-modal';
import { TableOrderInterface } from '../../../../Core/Models/TableModels/table-order-interface';
import { TableFilter } from '../../components/tables/table-filter/table-filter';
import { CustomTableModal } from '../../components/tables/custom-table-modal/custom-table-modal';
import { FormGroup } from '@angular/forms';


@Component({
  selector: 'app-table-page',
  standalone: true,
  imports: [
    Pagination,
    TableCard,
    ConfirmationModal,
    OrderDetailsModal,
    TableFilter,
    CustomTableModal,
  ],
  templateUrl: './tables-page.html',
})
export class TablesPage implements OnInit {
  private tableService = inject(TableService);

  // -----------------------State for tables and pagination-----------------------
  tables: TableInterface[] = [];
  pageIndex = 1;
  pageSize = 5;
  totalCount = 0;

  // -----------------------For Delete Confirmation Modal-----------------------
  showModal = false;
  isErrorModal = false;
  modalMessage = '';
  selectedTableId: number | null = null;

  // -----------------------For Order Details Modal-----------------------
  private tableOrdersService = inject(TableOrdersService);
  selectedOrder: TableOrderInterface | null = null;
  showOrderModal = false;

  // -----------------------Filters State-----------------------
  branchId?: number;
  isOccupied?: boolean;
  search?: string;

  // -----------------------State for Create/Edit Modal-----------------------
  showTableModal = false;
  isEditMode = false;
  selectedTable: TableInterface | null = null;
  ngOnInit(): void {
    this.loadTables();
  }
  // ------------------------- Data Loading & Pagination --------------------//
  loadTables() {
    this.tableService
      .getTables({
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        branchId: this.branchId,
        isOccupied: this.isOccupied,
        search: this.search,
      })
      .subscribe({
        next: (res) => {
          this.tables = res.data;
          this.totalCount = res.count;
        },
      });
  }

  // ------------ When page changes, update pageIndex and reload tables ----------------
  onPageChanged(page: number) {
    this.pageIndex = page;
    this.loadTables();
  }

  //------------------------- Event Handlers --------------------//
  onToggle(id: number) {
    this.tableService.toggleStatus(id).subscribe(() => {
      this.loadTables();
    });
  }

  // When delete button is clicked, we check if the table is occupied. If it is, we show an error modal. If not, we show a confirmation modal.
  onDelete(table: TableInterface) {
    if (table.isOccupied) {
      this.modalMessage = 'Cannot delete an occupied table';
      this.isErrorModal = true;
      this.showModal = true;
      return;
    }
    this.selectedTableId = table.id;
    this.modalMessage = 'Are you sure you want to delete this table?';
    this.isErrorModal = false;
    this.showModal = true;
  }

  // ------------------------- Modal Actions --------------------//
  confirmDelete() {
    if (!this.selectedTableId) return;

    this.tableService.deleteTable(this.selectedTableId).subscribe({
      next: () => {
        this.loadTables();
        this.closeModal();
      },
      error: (err) => {
        this.modalMessage = err.error || 'Failed to delete table';
        this.isErrorModal = true;
      },
    });
  }
  // ------------------------- Close modal and reset state --------------------//
  closeModal() {
    this.showModal = false;
    this.selectedTableId = null;
    this.isErrorModal = false;
  }

  // ------------------------- open order details for table --------------------//
  onOpenOrder(tableId: number) {
    this.tableOrdersService.getActiveOrder(tableId).subscribe({
      next: (orders) => {
        if (!orders || orders.length === 0) {
          this.selectedOrder = null;
          this.showOrderModal = true;
          return;
        }
        const orderId = orders[0].orderId;
        this.tableOrdersService.getOrderDetails(orderId).subscribe({
          next: (orderDetails) => {
            this.selectedOrder = orderDetails;
            this.showOrderModal = true;
          },
        });
      },
      error: (err) => console.error(err),
    });
  }

  // ------------------------- Close order details modal --------------------//
  closeOrderModal() {
    this.showOrderModal = false;
    this.selectedOrder = null;
  }

  // ------------------------- When filters change --------------------//
  onFilterChanged(filters: { branchId?: number; isOccupied?: boolean; search?: string }) {
    this.branchId = filters.branchId;
    this.isOccupied = filters.isOccupied;
    this.search = filters.search?.trim().toLowerCase();

    this.pageIndex = 1;
    this.loadTables();
  }

  // ------------------------- Open/Close/Save to Create Modal --------------------//
  openCreateModal() {
    this.isEditMode = false;
    this.selectedTable = null;
    this.showTableModal = true;
  }
  closeTableModal() {
    this.showTableModal = false;
  }

  openEditModal(table: TableInterface) {
    this.isEditMode = true;
    this.selectedTable = table;
    this.showTableModal = true;
  }

  onSaveTable(data: any) {
    if (this.isEditMode && this.selectedTable) {
      this.tableService.updateTable(this.selectedTable.id, data).subscribe(() => {
        this.loadTables();
        this.closeTableModal();
      });
    } else {
      this.tableService.createTable(data).subscribe(() => {
        this.loadTables();
        this.closeTableModal();
      });
    }
  }

  onEditTable(id: number) {
    const table = this.tables.find((t) => t.id === id);
    if (table) {
      this.openEditModal(table);
    }
  }
  //----------------------------------------------------------------------
}
