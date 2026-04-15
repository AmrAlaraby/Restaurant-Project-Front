import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Subscription, interval, switchMap } from 'rxjs';
import { Delivery } from '../../../../Core/Models/DeliveryModels/delivery';
import { UnAssignedDelivery } from '../../../../Core/Models/DeliveryModels/un-assigned-delivery';
import { User } from '../../../../Core/Models/DeliveryModels/user';
import { DeliveryService } from '../../../../Core/Services/Delivery-Service/delivery-service';

@Component({
  selector: 'app-home-page',
  imports: [CommonModule],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
})
export class HomePage implements OnInit, OnDestroy {
  private deliveryService = inject(DeliveryService);

  // Driver info (from JWT / auth service — adjust to your auth setup)
  driver: User | null = null;
  isOnline = true;

  // Stats
  deliveriesToday = 0;
  cashCollected = 0;
  ratingToday = 0;
  distanceToday = 0;

  // Active delivery
  activeDelivery: Delivery | null = null;

  // Pending assignments
  pendingAssignments: UnAssignedDelivery[] = [];

  // UI state
  loading = true;
  actionLoading: number | null = null; // tracks which delivery is being accepted/declined

  private pollSub?: Subscription;

  ngOnInit(): void {
    this.loadDashboard();
    // Poll every 30s for new assignments
    this.pollSub = interval(30000)
      .pipe(switchMap(() => this.deliveryService.getUnAssignedDeliveries()))
      .subscribe({
        next: (res) => (this.pendingAssignments = res),
        error: (err) => console.error('Poll error:', err),
      });
  }

  ngOnDestroy(): void {
    this.pollSub?.unsubscribe();
  }

  loadDashboard(): void {
    this.loading = true;

    // Load own assigned deliveries (active)
    this.deliveryService.getOwnAssignedDeliveries().subscribe({
      next: (data: Delivery[]) => {
        // Active = the first delivery that's not delivered yet
        this.activeDelivery =
          data.find((d) => d.deliveryStatus === 'Assigned' || d.deliveryStatus === 'PickedUp') ??
          null;

        // Stats from today's deliveries
        const today = new Date().toDateString();
        const todayDeliveries = data.filter(
          (d) => d.deliveredAt && new Date(d.deliveredAt).toDateString() === today,
        );

        this.deliveriesToday = todayDeliveries.length;
        this.cashCollected = todayDeliveries.reduce((sum, d) => sum + (d.cashCollected ?? 0), 0);
        // Rating & distance: placeholders — connect to your actual endpoint
        this.ratingToday = 4.9;
        this.distanceToday = 22;

        this.loading = false;
      },
      error: (err) => {
        console.error('Dashboard load error:', err);
        this.loading = false;
      },
    });

    // Load pending unassigned deliveries
    this.deliveryService.getUnAssignedDeliveries().subscribe({
      next: (res) => (this.pendingAssignments = res),
      error: (err) => console.error('Pending load error:', err),
    });
  }

  toggleOnlineStatus(): void {
    this.isOnline = !this.isOnline;
  }

  viewActiveDelivery(): void {
    if (!this.activeDelivery) return;
    // Navigate or open modal — wire to your router
    console.log('View delivery:', this.activeDelivery.id);
  }

  acceptDelivery(delivery: UnAssignedDelivery): void {
    this.actionLoading = delivery.deliveryId;

    // Get driver ID from stored user / JWT
    const driverId = this.getDriverId();

    this.deliveryService.assignDelivery({ deliveryId: delivery.deliveryId, driverId }).subscribe({
      next: () => {
        this.actionLoading = null;
        this.loadDashboard(); // refresh
      },
      error: (err) => {
        console.error('Accept error:', err);
        this.actionLoading = null;
      },
    });
  }

  declineDelivery(delivery: UnAssignedDelivery): void {
    // Remove from local list (backend may not have a decline endpoint)
    this.pendingAssignments = this.pendingAssignments.filter(
      (d) => d.deliveryId !== delivery.deliveryId,
    );
  }

  formatAddress(d: UnAssignedDelivery): string {
    const a = d.deliveryAddress;
    return `${a.buildingNumber} ${a.street}, ${a.city}`;
  }

  formatActiveAddress(): string {
    if (!this.activeDelivery) return '';
    const a = this.activeDelivery.deliveryAddress;
    return `${a.buildingNumber} ${a.street}, ${a.city}`;
  }

  private getDriverId(): string {
    // Adjust based on how you store user info
    const raw = localStorage.getItem('user');
    if (raw) {
      try {
        return JSON.parse(raw).id;
      } catch {
        return '';
      }
    }
    return '';
  }
}
