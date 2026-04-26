import { ActiveOrders } from './../../../waiter/components/active-orders/active-orders';
import { Component, inject, OnInit, signal } from '@angular/core';
import { CategoryList } from "../../components/Home/category-list/category-list";
import { PopularItems } from '../../components/Home/popular-items/popular-items';
import { Router } from '@angular/router';
import { OrdersService } from '../../../../Core/Services/Orders-Service/orders-service';
import { OrderDetailsInterface } from '../../../../Core/Models/OrderModels/order-details-interface';
import { AuthService } from '../../../../Core/Services/Auth-Service/auth-service';
import { SignalRService } from '../../../../Core/Services/SignalR-Service/SignalrService';
import { Delivery } from '../../../../Core/Models/DeliveryModels/delivery';

@Component({
  selector: 'app-home-page',
  imports: [CategoryList,PopularItems],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
})
export class HomePage implements OnInit {
ngOnInit(): void {
  this.loadOrders();
  this.listenToOrderUpdates();
}
private router = inject(Router);
private ordersService = inject(OrdersService);
private authService = inject(AuthService);
private signalR = inject(SignalRService);

ActiveOrders : OrderDetailsInterface[] =[];

goToBrowse() {
  this.router.navigate(['/customer/browse-menu']);
}

loadOrders() {
  let params = {
    pageNumber: 1,
    pageSize: 10,
    OrderType: 'Delivery',
  };

  this.ordersService.getMyActiveOrders(params).subscribe({
    next: (res) => {
      const all = res.data ?? [];
      // console.log(all.map((o: any) => ({ id: o.id, status: o.status }))); 
      this.ActiveOrders=all;
      // console.log(this.ActiveOrders);
    
    },
   
  });
}

  onTrackDelivery(orderId: number) {
  this.router.navigate(['/customer/track-delivery', orderId]);
} 

listenToOrderUpdates() {
        let token = this.authService.getAccessToken();
        this.signalR.startRestaurantUpdatesConnection(token??"");
        this.signalR.onRestaurantUpdate("OrderAssignedToDriver",(data :Delivery | null) => {
          if(data){
            let index = this.ActiveOrders.findIndex(o => o.id === data.order.id);
            if(index !== -1){
              if(this.ActiveOrders[index].delivery){
              this.ActiveOrders[index].delivery.deliveryStatus = data.deliveryStatus;
              this.ActiveOrders[index].delivery.driverName = data.driverName ?? undefined;
            }
            }
      }});
        this.signalR.onRestaurantUpdate("deliveryUpdated",(data :Delivery | null) => {
          if(data){
            let index = this.ActiveOrders.findIndex(o => o.id === data.order.id);
            if(index !== -1){
              
              if(this.ActiveOrders[index].delivery){
                this.ActiveOrders[index].delivery.deliveryStatus = data.deliveryStatus;
                this.ActiveOrders[index].delivery.driverName = data.driverName ?? undefined;
              }
              if(data.deliveryStatus === 'Delivered'){
        this.ActiveOrders.splice(index,1);
      }
            }
      }});
    
    
    this.signalR.onRestaurantUpdate("OrderUpdated",(data) => {   
      let index = this.ActiveOrders.findIndex(o => o.id === data.id);
      if(index !== -1 && index){
        this.ActiveOrders[index] = data;
      }
      if(data.status === 'Cancelled' || data.status === 'Delivered'){
        this.ActiveOrders.splice(index,1);
      }
    });

}
}
