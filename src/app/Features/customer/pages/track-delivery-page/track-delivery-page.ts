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
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-track-delivery-page',
  imports: [
    FormsModule, 
    CommonModule, 
    TrackDeliveryHeader, 
    TrackDriverCard, 
    TrackTimeline, 
    TrackInfoGrid,
    TranslatePipe
  ],
  templateUrl: './track-delivery-page.html',
  styleUrl: './track-delivery-page.scss',
})
export class TrackDeliveryPage implements OnInit {
   private route           = inject(ActivatedRoute);
  private router          = inject(Router);
  private deliveryService = inject(DeliveryService);
  private translate     = inject(TranslateService);
 
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
  const d = this.delivery();

  const driver =
    d?.driverName ||
    this.translate.instant('CUSTOMER.TRACK_DELIVERY.DEFAULTS.DRIVER');

  return [
    {
      key: 'Placed',
      label: 'CUSTOMER.TRACK_DELIVERY.TIMELINEOPJ.Placed.LABEL',
      doneDesc: 'CUSTOMER.TRACK_DELIVERY.TIMELINEOPJ.Placed.DONE',
      activeDesc: 'CUSTOMER.TRACK_DELIVERY.TIMELINEOPJ.Placed.ACTIVE',
      pendingDesc: 'CUSTOMER.TRACK_DELIVERY.TIMELINEOPJ.Placed.PENDING',
      timestamp: d?.order?.createdAt ?? null,
    },
    {
      key: 'Assigned',
      label: 'CUSTOMER.TRACK_DELIVERY.TIMELINEOPJ.Assigned.LABEL',
      doneDesc: 'CUSTOMER.TRACK_DELIVERY.TIMELINEOPJ.Assigned.DONE',
      activeDesc: 'CUSTOMER.TRACK_DELIVERY.TIMELINEOPJ.Assigned.ACTIVE',
      pendingDesc: 'CUSTOMER.TRACK_DELIVERY.TIMELINEOPJ.Assigned.PENDING',
      timestamp: d?.createdAt ?? null,
    },
    {
      key: 'PickedUp',
      label: 'CUSTOMER.TRACK_DELIVERY.TIMELINEOPJ.PickedUp.LABEL',
      doneDesc: 'CUSTOMER.TRACK_DELIVERY.TIMELINEOPJ.PickedUp.DONE',
      activeDesc: 'CUSTOMER.TRACK_DELIVERY.TIMELINEOPJ.PickedUp.ACTIVE',
      pendingDesc: 'CUSTOMER.TRACK_DELIVERY.TIMELINEOPJ.PickedUp.PENDING',
      timestamp: null,
    },
    {
      key: 'OnTheWay',
      label: 'CUSTOMER.TRACK_DELIVERY.TIMELINEOPJ.OnTheWay.LABEL',
      doneDesc: 'CUSTOMER.TRACK_DELIVERY.TIMELINEOPJ.OnTheWay.DONE',
      activeDesc: 'CUSTOMER.TRACK_DELIVERY.TIMELINEOPJ.OnTheWay.ACTIVE',
      pendingDesc: 'CUSTOMER.TRACK_DELIVERY.TIMELINEOPJ.OnTheWay.PENDING',
      timestamp: null,
    },
    {
      key: 'Delivered',
      label: 'CUSTOMER.TRACK_DELIVERY.TIMELINEOPJ.Delivered.LABEL',
      doneDesc: 'CUSTOMER.TRACK_DELIVERY.TIMELINEOPJ.Delivered.DONE',
      activeDesc: 'CUSTOMER.TRACK_DELIVERY.TIMELINEOPJ.Delivered.ACTIVE',
      pendingDesc: 'CUSTOMER.TRACK_DELIVERY.TIMELINEOPJ.Delivered.PENDING',
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
