import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UnAssignedDelivery } from '../../../../Core/Models/DeliveryModels/un-assigned-delivery';
import { AuthService } from '../../../../Core/Services/Auth-Service/auth-service';
import { DeliveryService } from '../../../../Core/Services/Delivery-Service/delivery-service';
import { BranchAssignedDeliveries } from '../branch-assigned-deliveries/branch-assigned-deliveries';

@Component({
  selector: 'app-branch-assign-deliveries',
  standalone: true,
  imports: [CommonModule, FormsModule, BranchAssignedDeliveries],
  templateUrl: './branch-assign-deliveries.html',
  styleUrls: ['./branch-assign-deliveries.scss'],
})
export class BranchAssignDeliveries implements OnInit {

  viewAssigned = false;

  orders: UnAssignedDelivery[] = [];
  filteredOrders: UnAssignedDelivery[] = [];
  drivers: any[] = [];
  loading = false;

  filterOrderId: number | null = null;

  selectedDrivers:    { [deliveryId: number]: string }  = {};
  dispatching:        { [deliveryId: number]: boolean } = {};
  confirmedAddresses: { [deliveryId: number]: string }  = {};

  private branchId!: number;
  private branchName!: string;

  constructor(
    private deliveryService: DeliveryService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe({
      next: (user) => {
        this.branchId   = user?.branchId   ?? 0;
        this.branchName = user?.branchName ?? '';
        this.loadOrders();
        this.loadDrivers();
      },
      error: (err) => console.error('Failed to get current user:', err),
    });
  }

  loadOrders(): void {
    this.loading = true;

    this.deliveryService.getUnAssignedDeliveries().subscribe({
      next: (res) => {
        this.orders = res.filter((d) => d.branchName === this.branchName);

        this.orders.forEach((o) => {
          this.selectedDrivers[o.deliveryId]    = '';
          this.dispatching[o.deliveryId]        = false;
          this.confirmedAddresses[o.deliveryId] =
            `${o.deliveryAddress.buildingNumber ?? ''} ${o.deliveryAddress.street}, ${o.deliveryAddress.city}`.trim();
        });

        this.applyOrderFilter();
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load orders:', err);
        this.loading = false;
      },
    });
  }

  loadDrivers(): void {
    if (!this.branchId) return;

    this.deliveryService.getAvailableDriversByBranch(this.branchId).subscribe({
      next: (res) => { this.drivers = res.data ?? res; },
      error: (err) => console.error('Failed to load drivers:', err),
    });
  }

  applyOrderFilter(): void {
    if (!this.filterOrderId) {
      this.filteredOrders = [...this.orders];
    } else {
      this.filteredOrders = this.orders.filter(
        (o) => String(o.orderNumber).includes(String(this.filterOrderId))
      );
    }
  }

  dispatch(order: UnAssignedDelivery): void {
    const driverId = this.selectedDrivers[order.deliveryId];
    if (!driverId) return;

    this.dispatching[order.deliveryId] = true;

    const dto = {
      orderId:         order.orderNumber,
      driverId:        driverId,
      deliveryAddress: order.deliveryAddress,
    };

    this.deliveryService.assignDelivery(dto).subscribe({
      next: () => {
        this.orders = this.orders.filter((o) => o.deliveryId !== order.deliveryId);
        this.applyOrderFilter();
        this.dispatching[order.deliveryId] = false;
      },
      error: (err) => {
        console.error('Assign failed:', err);
        this.dispatching[order.deliveryId] = false;
      },
    });
  }

  get awaitingCount(): number {
    return this.orders.length;
  }
}
