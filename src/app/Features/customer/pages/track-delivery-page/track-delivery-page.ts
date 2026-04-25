import { Component, inject, OnInit, signal } from '@angular/core';
import { DeliveryService } from '../../../../Core/Services/Delivery-Service/delivery-service';
import { ActivatedRoute, Router } from '@angular/router';
import { Delivery } from '../../../../Core/Models/DeliveryModels/delivery';
import { TimelineStep } from '../../../../Core/Models/DeliveryModels/track-delivery-types';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TrackDeliveryHeader } from "../../components/track-delivery/track-delivery-header/track-delivery-header";
import { TrackDriverCard } from "../../components/track-delivery/track-driver-card/track-driver-card";
import { TrackTimeline } from "../../components/track-delivery/track-time-line/track-time-line";
import { TrackInfoGrid } from "../../components/track-delivery/track-info-grid/track-info-grid";

@Component({
  selector: 'app-track-delivery-page',
  imports: [FormsModule, CommonModule, TrackDeliveryHeader, TrackDriverCard, TrackTimeline, TrackInfoGrid],
  templateUrl: './track-delivery-page.html',
  styleUrl: './track-delivery-page.scss',
})
export class TrackDeliveryPage implements OnInit {
   private route           = inject(ActivatedRoute);
  private router          = inject(Router);
  private deliveryService = inject(DeliveryService);
 
  loading  = signal(true);
  delivery = signal<Delivery | null>(null);
 
  // ── Status → step index (unchanged logic) ────────────────────────────────
  private readonly statusIndex: Record<string, number> = {
    Assigned:  1,
    PickedUp:  2,
    OnTheWay:  3,
    Delivered: 4,
  };
 
  get currentIndex(): number {
    return this.statusIndex[this.delivery()?.deliveryStatus ?? 'Assigned'] ?? 1;
  }
 
  get steps(): TimelineStep[] {
    const d      = this.delivery();
    const driver = d?.driverName || 'Your driver';
    return [
      {
        key: 'Placed',
        label: 'Order Placed',
        doneDesc: 'Your order was confirmed',
        activeDesc: 'Waiting for confirmation...',
        pendingDesc: 'Waiting...',
        timestamp: d?.order?.createdAt ?? null,
      },
      {
        key: 'Assigned',
        label: 'Being Prepared',
        doneDesc: 'Kitchen started your order',
        activeDesc: 'Kitchen is preparing your order',
        pendingDesc: 'Waiting...',
        timestamp: d?.createdAt ?? null,
      },
      {
        key: 'PickedUp',
        label: 'Picked Up',
        doneDesc: `${driver} picked up your order`,
        activeDesc: `${driver} is picking up your order`,
        pendingDesc: 'Waiting for pickup...',
        timestamp: null,
      },
      {
        key: 'OnTheWay',
        label: 'On the Way',
        doneDesc: 'Driver headed to your address',
        activeDesc: 'Driver is heading to your address',
        pendingDesc: 'Not yet...',
        timestamp: null,
      },
      {
        key: 'Delivered',
        label: 'Delivered',
        doneDesc: 'Order delivered successfully! 🎉',
        activeDesc: 'Order delivered!',
        pendingDesc: 'Estimated arrival soon',
        timestamp: d?.deliveredAt ?? null,
      },
    ];
  }
 
  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) this.loadDeliveryByOrderId(id);
  }
 
  loadDeliveryByOrderId(orderId: number) {
    this.loading.set(true);
    this.deliveryService.getAll(1, 100,{orderId:orderId}).subscribe({
      next: (res) => {
        console.log(res);
        
        const match = res.data?.find((d: any) => d.order?.id === orderId);
        if (match) this.delivery.set(match);
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false)
        console.log(err);
        
      },
    });
  }
 
  callDriver() {
    alert('Call feature requires driver phone number from API');
  }
 
  messageDriver() {
    alert('Message feature requires driver phone number from API');
  }
 
  goBack() {
    this.router.navigate(['/customer/my-orders']);
  }
}
