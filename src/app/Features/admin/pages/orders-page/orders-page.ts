import { Component, OnInit } from '@angular/core';
import { PaginatedResultInterface } from '../../../../Core/Models/MenuItemModels/paginated-result-interface';
import { OrderInterface } from '../../../../Core/Models/OrderModels/order-interface';
import { OrdersService } from '../../../../Core/Services/Orders-Service/orders-service';
import { OrderStats } from '../../components/order-stats/order-stats';
import { OrderFilters } from '../../components/order-filters/order-filters';
import { OrderTable } from '../../components/order-table/order-table';
import { OrderModal } from '../../components/order-modal/order-modal';
import { OrderPagination } from '../../components/order-pagination/order-pagination';
import { OrderDetails } from '../../components/order-details/order-details';
import { KitchenService } from '../../../../Core/Services/Kitchen-Service/kitchen-service';
import { BranchDto } from '../../../../Core/Models/BranchModels/Branch-dto';
import { Pagination } from "../../../../Shared/Components/pagination/pagination";

@Component({
  selector: 'app-orders-page',
  imports: [OrderStats, OrderFilters, OrderTable, OrderModal, OrderPagination, OrderDetails, Pagination],
  templateUrl: './orders-page.html',
  styleUrl: './orders-page.scss',
})
export class OrdersPage implements OnInit {

  orders: OrderInterface[] = [];
  totalCount = 0;

  filters: any = {
    pageIndex: 1,
    pageSize: 10,
    Ordertype: '',
    status: '',
    branchId: ''
  };
  selectedOrderId: number | null = null;
  showDetailsModal = false;
  showModal = false;
  branches: BranchDto[] = [];

  constructor(private ordersService: OrdersService,
    private KitchenService: KitchenService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders() {
    this.ordersService.getAllOrders(this.filters).subscribe(res => {
      this.orders = res.data;
      this.totalCount = res.count;
    });
    this.KitchenService.getBranches().subscribe(res => {
      this.branches = res;
    });
  }

  openModal() {
    console.log("clicked");
    
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.loadOrders();
  }

  onFilterChange(filters: any) {
    this.filters = { ...this.filters, ...filters };
    this.filters.pageIndex = 1; // Reset to first page on filter change
    this.loadOrders();
  }

  onPageChange(page: number) {
    this.filters.pageIndex = page;
    this.loadOrders();
  }

    openOrder(id: number) {
      debugger;
    this.selectedOrderId = id;
    this.showDetailsModal = true;
  }

  closeOrderModal() {
    this.showDetailsModal = false;
    this.selectedOrderId = null;
    this.loadOrders();
  }

}