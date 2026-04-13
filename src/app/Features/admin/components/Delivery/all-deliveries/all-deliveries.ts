import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { Delivery } from '../../../../../Core/Models/DeliveryModels/delivery';
import { DeliveryService } from '../../../../../Core/Services/Delivery-Service/delivery-service';
import { Pagination } from "../../../../../Shared/Components/pagination/pagination";
import { Branch } from '../../../../../Core/Constants/Api_Urls';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-all-deliveries',
  standalone: true,
  imports: [CommonModule, FormsModule, Pagination],
  templateUrl: './all-deliveries.html',
  styleUrls: ['./all-deliveries.scss'],
})
export class AllDeliveries {

  deliveries: Delivery[] = [];

  pageIndex = 1;
  pageSize = 5;
  totalCount = 0;

  loading = false;

  // 🔥 Filters
  filters = {
    branchId: null,
    status: null,
    date: null,
    orderId: null
  };

  branches: any[] = [];
  statuses: string[] = [
    'Assigned',
    'PickedUp',
    'OnTheWay',
    'Delivered'
  ];

  constructor(
    private service: DeliveryService,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    this.load();
    this.loadBranches();
  }

  // 🔥 Load all deliveries
  load() {
    this.loading = true;

    this.service.getAll(this.pageIndex, this.pageSize, this.filters)
      .subscribe({
        next: res => {
          this.deliveries = res.data;
          this.totalCount = res.count;
          this.loading = false;
        },
        error: _ => this.loading = false
      });
  }

  // 🔥 Pagination
  onPageChanged(page: number) {
    this.pageIndex = page;
    this.load();
  }

  // 🔥 Load branches dropdown
  loadBranches() {
    this.http.get<any[]>(Branch.getAll)
      .subscribe({
        next: res => {
          this.branches = res;
        }
      });
  }

  // 🔥 Apply filters
  applyFilters() {
    this.pageIndex = 1;
    this.load();
  }

  // 🔥 Open details page
  openDetails(id: number) {
    this.router.navigate(['/deliveries', id]);
  }
}
