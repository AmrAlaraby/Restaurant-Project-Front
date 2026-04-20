import { Component, OnInit } from '@angular/core';
import { OrderInterface } from '../../../../Core/Models/OrderModels/order-interface';
import { OrdersService } from '../../../../Core/Services/Orders-Service/orders-service';
import { KitchenService } from '../../../../Core/Services/Kitchen-Service/kitchen-service';
import { BranchDto } from '../../../../Core/Models/BranchModels/Branch-dto';
import { Pagination } from "../../../../Shared/Components/pagination/pagination";
import { OrderDetails } from '../../components/Order/order-details/order-details';
import { OrderFilters } from '../../components/Order/order-filters/order-filters';
import { OrderModal } from '../../components/Order/order-modal/order-modal';
import { OrderStats } from '../../components/Order/order-stats/order-stats';
import { OrderTable } from '../../components/Order/order-table/order-table';
import { AuthService } from '../../../../Core/Services/Auth-Service/auth-service';
import { SignalRService } from '../../../../Core/Services/SignalR-Service/SignalrService';

@Component({
  selector: 'app-orders-page',
  imports: [OrderStats, OrderFilters, OrderTable, OrderModal, OrderDetails, Pagination],
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
    private KitchenService: KitchenService,
    private authService: AuthService,
    private signalR: SignalRService,
  ) {}

  ngOnInit(): void {
    this.loadOrders();
        let token = this.authService.getAccessToken();
    this.signalR.startRestaurantUpdatesConnection(token??"");

    
    this.signalR.onRestaurantUpdate("OrderCreated",(data) => {   
      this.orders.unshift(data);
      this.totalCount++;
    });
    
    this.signalR.onRestaurantUpdate("OrderUpdated",(data) => {   
      let index = this.orders.findIndex(o => o.id === data.id);
      if(index !== -1 && index){
        this.orders[index] = data;
      }
    });
    this.signalR.onRestaurantUpdate("OrderCancelled",(data) => {   
      let index = this.orders.findIndex(o => o.id === data.id);
      if(index !== -1 && index){
        this.orders[index] = data;
      }
    });
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
    this.selectedOrderId = id;
    this.showDetailsModal = true;
  }

  closeOrderModal() {
    this.showDetailsModal = false;
    this.selectedOrderId = null;
    this.loadOrders();
  }

}
