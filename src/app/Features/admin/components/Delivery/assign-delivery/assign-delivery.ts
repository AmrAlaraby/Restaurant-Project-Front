import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DeliveryService } from '../../../../../Core/Services/Delivery-Service/delivery-service';
import { TranslatePipe } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { LocalizationService } from '../../../../../Core/Services/Localization-Service/localization-service';

@Component({
  selector: 'app-assign-delivery',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe],
  templateUrl: './assign-delivery.html',
  styleUrls: ['./assign-delivery.scss'],
})
export class AssignDelivery implements OnInit {
  branches: any[] = [];
  deliveries: any[] = [];
  drivers: any[] = [];

  selectedBranch: any = null;
  selectedDelivery: any = null;
  selectedDriverId: string = '';

  loadingDeliveries = false;
  loadingDrivers = false;
  assigning = false;

  constructor(
    private deliveryService: DeliveryService,
    private localizationService: LocalizationService,
  ) {}

  ngOnInit(): void {
    this.loadBranches();
    this.getCurrentLanguage();
  }

  CurrentLanguage: string = 'en';

  private destroy$ = new Subject<void>();
  getCurrentLanguage(): void {
    this.CurrentLanguage = this.localizationService.getCurrentLang();
    this.localizationService.currentLang$.pipe(takeUntil(this.destroy$)).subscribe((lang) => {
      this.CurrentLanguage = lang;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }



  loadBranches() {
    this.deliveryService.getBranches().subscribe({
      next: (res) => {
        this.branches = res;
        console.log('Branches:', this.branches);
      },
      error: (err) => console.error('Failed to load branches:', err),
    });
  }

  onBranchChange(branch: any) {
    this.selectedBranch = branch;
    this.selectedDelivery = null;
    this.selectedDriverId = '';
    this.deliveries = [];
    this.drivers = [];

    if (!branch) return;

    this.loadDeliveriesByBranch(branch.id);
  }

  loadDeliveriesByBranch(branchId: number) {
    this.loadingDeliveries = true;

    this.deliveryService.getUnAssignedDeliveries().subscribe({
      next: (res) => {
        this.deliveries = res.filter((d: any) => d.branchName === this.selectedBranch.name);
        this.loadingDeliveries = false;
      },
      error: (err) => {
        console.error(err);
        this.loadingDeliveries = false;
      },
    });
  }

  onDeliveryChange(delivery: any) {
    this.selectedDelivery = delivery;
    this.selectedDriverId = '';
    this.drivers = [];

    if (!delivery) return;

    this.loadDriversByBranchId(this.selectedBranch.id);
  }

  loadDriversByBranchId(branchId: number) {
    this.loadingDrivers = true;

    this.deliveryService.getAvailableDriversByBranch(branchId).subscribe({
      next: (res) => {
        this.drivers = res.data ?? res;
        this.loadingDrivers = false;
      },
      error: (err) => {
        console.error(err);
        this.loadingDrivers = false;
      },
    });
  }

  assign() {
    debugger;
    if (!this.selectedDelivery || !this.selectedDriverId) return;
    console.log(this.selectedDelivery);

    const dto = {
      orderId: this.selectedDelivery.orderNumber,
      driverId: this.selectedDriverId,
      deliveryAddress: this.selectedDelivery.deliveryAddress,
    };

    this.assigning = true;

    this.deliveryService.assignDelivery(dto).subscribe({
      next: () => {
        alert('Assigned successfully ✅');
        this.assigning = false;

        this.deliveries = this.deliveries.filter(
          (d) => d.deliveryId !== this.selectedDelivery.deliveryId,
        );

        this.selectedDelivery = null;
        this.selectedDriverId = '';
        this.drivers = [];
      },
      error: (err) => {
        console.error(err);
        this.assigning = false;
      },
    });
  }

    getBranchName(item: any): string {
    if (this.CurrentLanguage === 'ar') {
      return item.arabicName || item.name;
    }
    return item.name;
  }
}
