import { SignalRService } from './../../../../Core/Services/SignalR-Service/SignalrService';
import { CommonModule, DecimalPipe } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, signal, computed } from '@angular/core';
import { Subscription } from 'rxjs';
import { Delivery } from '../../../../Core/Models/DeliveryModels/delivery';
import { User } from '../../../../Core/Models/DeliveryModels/user';
import { DeliveryService } from '../../../../Core/Services/Delivery-Service/delivery-service';
import { UsersService } from '../../../../Core/Services/User-Service/users-service';
import { AuthService } from '../../../../Core/Services/Auth-Service/auth-service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, DecimalPipe,TranslatePipe],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
})
export class HomePage implements OnInit, OnDestroy {
  private deliveryService = inject(DeliveryService);
  private usersService = inject(UsersService);
  private authService = inject(AuthService);
  private SignalRService = inject(SignalRService);

  // ── Signals ──────────────────────────────────────────────────────
  driver = signal<User | null>(null);
  // isOnline = signal<boolean>(true);
  loading = signal<boolean>(true);

  deliveriesToday = signal<number>(0);
  cashCollected = signal<number>(0);
  ratingToday = signal<number>(0);
  distanceToday = signal<number>(0);
  deliveredCount = signal<number>(0); // ← إجمالي الأوردرات اللي اتوصلت
  deliveredCountLoading = signal<boolean>(false);

  activeDelivery = signal<Delivery | null>(null);
  doneOrders = signal<Delivery[]>([]);

  // ── Computed ─────────────────────────────────────────────────────
  driverFirstName = computed(() => this.driver()?.name?.split(' ')?.[0] || 'Driver');
  driverInitial = computed(() => this.driver()?.name?.charAt(0) || 'Y');
  branchLabel = computed(() => this.driver()?.branchName || 'Branch 1');

  private pollSub?: Subscription; // kept for future polling if needed

  // ─────────────────────────────────────────────────────────────────
  ngOnInit(): void {
    this.loadDriverInfo();
    this.loadDashboard();
    this.loadDeliveredCount();
    this.listenToUpdates()
  }

  ngOnDestroy(): void {}

  // ─────────────────────────────────────────────────────────────────
  private loadDriverInfo(): void {
    // ① جيب الـ current user من الـ token مباشرة
    this.authService.getCurrentUser().subscribe({
      next: (currentUser) => {
        // ② ملّي الـ driver فوراً من بيانات الـ token
        this.driver.set({
          id: currentUser.id,
          name: currentUser.name,
          email: currentUser.email,
          roleId: currentUser.role,
          branchId: currentUser.branchId ?? null,
          branchName: currentUser.branchName ?? null,
        });

        // ③ حدّث بـ getUserDetails لو فيه بيانات أكتر (branchName إلخ)
        this.usersService.getUserDetails(currentUser.id).subscribe({
          next: (details) => {
            this.driver.set({
              id: details.id,
              name: details.name,
              email: details.email,
              roleId: details.roleId,
              branchId: details.branchId ?? null,
              branchName: details.branchName ?? null,
            });
          },
          error: (err) => {
            // currentUser data كافية — مش مشكلة
            console.warn('getUserDetails failed, using currentUser data:', err);
          },
        });
      },
      error: (err) => {
        console.error('getCurrentUser failed:', err);
      },
    });
  }

  listenToUpdates(): void {
    let token = this.authService.getAccessToken();
    this.SignalRService.startRestaurantUpdatesConnection(token??"");
    this.SignalRService.onRestaurantUpdate("OrderAssignedToDriver",(data :Delivery | null) => {
    this.activeDelivery.set(data);
  });
}

  loadDashboard(): void {
    this.loading.set(true);

    this.deliveryService.getOwnAssignedDeliveries().subscribe({
      next: (deliveries) => {
        this.handleDeliveries(deliveries || []);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Dashboard error:', err);
        this.loading.set(false);
      },
    });
  }

  /**
   * تجيب عدد الأوردرات اللي الدرايفر وصلها فعلاً
   * عبر DeliveryService.getDeliveredCount()
   */
  loadDeliveredCount(): void {
    this.deliveredCountLoading.set(true);

    this.deliveryService.getDeliveredCount().subscribe({
      next: (count) => {
        this.deliveredCount.set(count);
        this.deliveredCountLoading.set(false);
      },
      error: (err) => {
        console.error('Delivered count error:', err);
        this.deliveredCountLoading.set(false);
      },
    });
  }

  private handleDeliveries(deliveries: Delivery[]): void {
    const active =
      deliveries.find((d) =>
        ['Assigned', 'PickedUp', 'OnTheWay'].includes(String(d.deliveryStatus)),
      ) ?? null;
    this.activeDelivery.set(active);

    const todayDeliveries = deliveries.filter((d) => d.deliveredAt && this.isToday(d.deliveredAt!));
    this.deliveriesToday.set(todayDeliveries.length);

    // ── إجمالي كلي للـ cash من كل الـ Delivered orders ──────────────
    const allDelivered = deliveries.filter((d) => String(d.deliveryStatus) === 'Delivered');
    this.cashCollected.set(
      allDelivered.reduce((sum, d) => sum + (Number(d.cashCollected) || 0), 0),
    );

    // ── عرض الـ Delivered orders في الـ Done Orders section ──────────
    this.doneOrders.set(allDelivered);

    this.ratingToday.set(4.9);
    this.distanceToday.set(22);
  }

  // ─── Actions ─────────────────────────────────────────────────────
  // toggleOnlineStatus(): void {
  //   this.isOnline.update((v) => !v);
  // }

  viewActiveDelivery(): void {
    const delivery = this.activeDelivery();
    if (!delivery) return;
    console.log('View delivery:', delivery.id);
    // TODO: router.navigate(['/delivery', delivery.id])
  }

  // ─── Helpers ─────────────────────────────────────────────────────
  formatDeliveredAddress(d: Delivery): string {
    const a = d.deliveryAddress;
    if (!a) return '';
    return `${a.buildingNumber || ''} ${a.street || ''}, ${a.city || ''}`.trim();
  }

  formatActiveAddress(): string {
    const a = this.activeDelivery()?.deliveryAddress;
    if (!a) return '';
    return `${a.buildingNumber || ''} ${a.street || ''}, ${a.city || ''}`.trim();
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
}
