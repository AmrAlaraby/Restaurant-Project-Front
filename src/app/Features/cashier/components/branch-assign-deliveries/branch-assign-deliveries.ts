import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UnAssignedDelivery } from '../../../../Core/Models/DeliveryModels/un-assigned-delivery';
import { AuthService } from '../../../../Core/Services/Auth-Service/auth-service';
import { DeliveryService } from '../../../../Core/Services/Delivery-Service/delivery-service';


@Component({
  selector: 'app-branch-assign-deliveries',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './branch-assign-deliveries.html',
  styleUrls: ['./branch-assign-deliveries.scss'],
})
export class BranchAssignDeliveries implements OnInit {

  orders: UnAssignedDelivery[] = [];
  drivers: any[] = [];
  loading = false;

  // map: deliveryId → selected driverId
  selectedDrivers: { [deliveryId: number]: string } = {};

  // map: deliveryId → is dispatching
  dispatching: { [deliveryId: number]: boolean } = {};

  // map: deliveryId → confirmed address (editable)
  confirmedAddresses: { [deliveryId: number]: string } = {};

  private branchId!: number;
  private branchName!: string;

  constructor(
    private deliveryService: DeliveryService,
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe({
      next: (user) => {
        this.branchId   = user?.branchId ?? 0;
        this.branchName = user?.branchName ?? '';
        this.loadOrders();
        this.loadDrivers();
      },
      error: (err) => console.error('Failed to get current user:', err),
    });
  }

  /** جيب الأوردرات الـ unassigned الخاصة بالفرع */
  loadOrders(): void {
    this.loading = true;

    this.deliveryService.getUnAssignedDeliveries().subscribe({
      next: (res) => {
        this.orders = res.filter((d) => d.branchName === this.branchName);

        // initialize maps
        this.orders.forEach((o) => {
          this.selectedDrivers[o.deliveryId]    = '';
          this.dispatching[o.deliveryId]        = false;
          this.confirmedAddresses[o.deliveryId] =
            `${o.deliveryAddress.buildingNumber ?? ''} ${o.deliveryAddress.street}, ${o.deliveryAddress.city}`.trim();
        });

        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load orders:', err);
        this.loading = false;
      },
    });
  }

  /** جيب الـ drivers المتاحين في نفس الفرع */
  loadDrivers(): void {
    if (!this.branchId) return;

    this.deliveryService.getAvailableDriversByBranch(this.branchId).subscribe({
      next: (res) => {
        this.drivers = res.data ?? res;
      },
      error: (err) => console.error('Failed to load drivers:', err),
    });
  }

  /** هل الأوردر دا Ready to dispatch (بمعنى مش Kitchen Preparing) */
  isReady(order: UnAssignedDelivery): boolean {
    // لو الـ API بيرجع status ممكن تستخدمه هنا
    // للأوردرات اللي مفيهاش status نعتبرها ready
    return true;
  }

  /** dispatch أوردر معين */
  dispatch(order: UnAssignedDelivery): void {
    const driverId = this.selectedDrivers[order.deliveryId];
    if (!driverId) return;

    this.dispatching[order.deliveryId] = true;

    const dto = {
      orderId: order.orderNumber,
      driverId: driverId,
      deliveryAddress: order.deliveryAddress,
    };

    this.deliveryService.assignDelivery(dto).subscribe({
      next: () => {
        // شيل الأوردر من الليست
        this.orders = this.orders.filter((o) => o.deliveryId !== order.deliveryId);
        this.dispatching[order.deliveryId] = false;
      },
      error: (err) => {
        console.error('Assign failed:', err);
        this.dispatching[order.deliveryId] = false;
      },
    });
  }

  /** روح لصفحة الأوردرات اللي اتضافلها سواق */
  goToAssigned(): void {
    this.router.navigate(['/admin/deliveries'], {
      queryParams: { branchId: this.branchId, status: 'Assigned' },
    });
  }

  get awaitingCount(): number {
    return this.orders.length;
  }

  getDriverName(driverId: string): string {
    const d = this.drivers.find((dr) => dr.driverId === driverId);
    return d ? d.name : '';
  }
}
