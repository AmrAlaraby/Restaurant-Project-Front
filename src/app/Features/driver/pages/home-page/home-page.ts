import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Subscription, forkJoin, interval, switchMap, of } from 'rxjs';
import { Delivery } from '../../../../Core/Models/DeliveryModels/delivery';
import { UnAssignedDelivery } from '../../../../Core/Models/DeliveryModels/un-assigned-delivery';
import { User } from '../../../../Core/Models/DeliveryModels/user';
import { DeliveryService } from '../../../../Core/Services/Delivery-Service/delivery-service';
import { UsersService } from '../../../../Core/Services/User-Service/users-service';

// 👇 VM type بسيط للـ UI فقط
type UnAssignedDeliveryVM = UnAssignedDelivery & {
  totalAmount: number;
};

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
})
export class HomePage implements OnInit, OnDestroy {
  private deliveryService = inject(DeliveryService);
  private usersService = inject(UsersService);

  driver: User | null = null;
  isOnline = true;

  deliveriesToday = 0;
  cashCollected = 0;
  ratingToday = 0;
  distanceToday = 0;

  activeDelivery: Delivery | null = null;

  // 👇 التعديل هنا
  pendingAssignments: UnAssignedDeliveryVM[] = [];

  loading = true;
  actionLoading: number | null = null;

  private pollSub?: Subscription;

  ngOnInit(): void {
    this.loadDriverInfo();
    this.loadDashboard();

    this.pollSub = interval(30000)
      .pipe(
        switchMap(() => {
          if (!this.isOnline) return of([]);
          return this.deliveryService.getUnAssignedDeliveries();
        }),
      )
      .subscribe({
        next: (res) => {
          if (Array.isArray(res)) {
            this.pendingAssignments = this.normalizePending(res);
          }
        },
        error: (err) => console.error('Poll error:', err),
      });
  }

  ngOnDestroy(): void {
    this.pollSub?.unsubscribe();
  }

  private loadDriverInfo(): void {
    const raw = localStorage.getItem('user');

    if (!raw) return;

    try {
      const user = JSON.parse(raw);

      this.usersService.getUserDetails(user.id).subscribe({
        next: (res) => {
          console.log('USER DETAILS RESPONSE:', res);

          this.driver = {
            id: res.id,
            name: res.name,
            email: res.email,
            roleId: res.roleId,
            branchId: res.branchId ?? null,
            branchName: res.branchName ?? null,
          };
        },
        error: (err) => {
          console.log('USER DETAILS ERROR:', err);
          this.driver = user;
        },
      });
    } catch {
      this.driver = null;
    }
  }

  loadDashboard(): void {
    this.loading = true;

    forkJoin({
      deliveries: this.deliveryService.getOwnAssignedDeliveries(),
      pending: this.deliveryService.getUnAssignedDeliveries(),
    }).subscribe({
      next: ({ deliveries, pending }) => {
        this.pendingAssignments = this.normalizePending(pending);

        this.handleDeliveries(deliveries || []);
        this.loading = false;
      },
      error: (err) => {
        console.error('Dashboard error:', err);
        this.loading = false;
      },
    });
  }

  private handleDeliveries(deliveries: Delivery[]): void {
    this.activeDelivery =
      deliveries.find((d) =>
        ['Assigned', 'PickedUp', 'OnTheWay'].includes(String(d.deliveryStatus)),
      ) ?? null;

    const todayDeliveries = deliveries.filter((d) => d.deliveredAt && this.isToday(d.deliveredAt!));

    this.deliveriesToday = todayDeliveries.length;

    this.cashCollected = todayDeliveries.reduce((sum, d) => {
      return sum + (Number(d.cashCollected) || 0);
    }, 0);

    this.ratingToday = 4.9;
    this.distanceToday = 22;
  }

  toggleOnlineStatus(): void {
    this.isOnline = !this.isOnline;
  }

  viewActiveDelivery(): void {
    if (!this.activeDelivery) return;
    console.log('View delivery:', this.activeDelivery.id);
  }

  private isToday(date: string): boolean {
    const d = new Date(date);
    const today = new Date();

    return (
      d.getFullYear() === today.getFullYear() &&
      d.getMonth() === today.getMonth() &&
      d.getDate() === today.getDate()
    );
  }

  acceptDelivery(delivery: UnAssignedDeliveryVM): void {
    this.actionLoading = delivery.deliveryId;

    let driverId: string;

    try {
      driverId = this.getDriverId();
    } catch (e) {
      console.error(e);
      this.actionLoading = null;
      return;
    }

    this.deliveryService
      .assignDelivery({
        deliveryId: delivery.deliveryId,
        driverId,
      })
      .subscribe({
        next: () => {
          // 1) remove instantly from UI
          this.pendingAssignments = this.pendingAssignments.filter(
            (d) => d.deliveryId !== delivery.deliveryId,
          );

          // 2) set active delivery immediately
          this.activeDelivery = {
            id: delivery.deliveryId,
            deliveryStatus: 'Assigned',
            createdAt: new Date().toISOString(),
            deliveredAt: null,
            cashCollected: null,
            driverName: this.driver?.name || null,
            order: {
              id: Number(delivery.orderNumber),
              totalAmount: delivery.totalAmount,
              itemsCount: delivery.itemsCount,
              status: 'Assigned',
              orderType: 'Delivery',
              branchName: null,
              createdAt: new Date().toISOString(),
              items: [],
              calculatedTotal: delivery.totalAmount,
            },
            deliveryAddress: delivery.deliveryAddress,
          } as any;

          // 3) stop loading
          this.actionLoading = null;

          // 4) refresh dashboard stats
          this.loadDashboard();
        },

        error: (err) => {
          console.error('Accept error:', err);
          this.actionLoading = null;
        },
      });
  }

  declineDelivery(delivery: UnAssignedDeliveryVM): void {
    this.pendingAssignments = this.pendingAssignments.filter(
      (d) => d.deliveryId !== delivery.deliveryId,
    );
  }

  formatAddress(d: UnAssignedDeliveryVM): string {
    const a = d.deliveryAddress;
    if (!a) return '';

    return `${a.buildingNumber || ''} ${a.street || ''}, ${a.city || ''}`;
  }

  formatActiveAddress(): string {
    if (!this.activeDelivery?.deliveryAddress) return '';

    const a = this.activeDelivery.deliveryAddress;

    return `${a.buildingNumber || ''} ${a.street || ''}, ${a.city || ''}`;
  }

  private normalizePending(res: UnAssignedDelivery[]): UnAssignedDeliveryVM[] {
    return res.map((x) => ({
      ...x,
      totalAmount: 0,
    }));
  }

  private getDriverId(): string {
    const raw = localStorage.getItem('user');

    if (!raw) throw new Error('User not logged in');

    const parsed = JSON.parse(raw);

    if (!parsed?.id) throw new Error('Invalid user data');

    return parsed.id;
  }
}
