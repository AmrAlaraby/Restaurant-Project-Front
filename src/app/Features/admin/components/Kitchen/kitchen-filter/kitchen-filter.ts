import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { KitchenTicketQueryParams } from '../../../../../Core/Models/KitchenModels/kitchen-ticket-query-params';
import { BranchDto } from '../../../../../Core/Models/BranchModels/Branch-dto';
import { ActivePendingStationsDTO } from '../../../../../Core/Models/KitchenModels/active-pending-stations-dto';
import { TicketStatus } from '../../../../../Core/Models/KitchenModels/ticket-status';
import { KitchenService } from '../../../../../Core/Services/Kitchen-Service/kitchen-service';

@Component({
  selector: 'app-kitchen-filter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './kitchen-filter.html',
  styleUrls: ['./kitchen-filter.scss'],
})
export class KitchenFilterComponent implements OnInit {

  @Output() filterChanged = new EventEmitter<KitchenTicketQueryParams>();


  branches: BranchDto[] = [];

  stations: ActivePendingStationsDTO[] = [];


  params: KitchenTicketQueryParams = {
    branchId: null,
    orderId: null,
    station: null,
    status: null,
  };

  TicketStatus = TicketStatus;

  statusOptions = [
    { label: 'All', value: null },
    { label: 'Pending', value: TicketStatus.Pending },
    { label: 'Preparing', value: TicketStatus.Preparing },
    { label: 'Done', value: TicketStatus.Done },
  ];

  constructor(private kitchenService: KitchenService) {}

  ngOnInit(): void {
    this.kitchenService.getBranches().subscribe({
      next: (data: BranchDto[]) => {
        console.log('Branches:', data);
        this.branches = data;
      },
      error: (err) => console.error('Failed to load branches', err)
    });
  }

  onBranchChange(): void {
    this.params.station = null;
    this.stations = [];

    if (this.params.branchId) {
      this.kitchenService.getActiveStations(this.params.branchId).subscribe({
        next: (data) => this.stations = data,
        error: (err) => console.error('Failed to load stations', err)
      });
    }
  }

  onApply(): void {
    this.filterChanged.emit({ ...this.params });
  }

  onReset(): void {
    this.params = {
      branchId: null,
      orderId: null,
      station: null,
      status: null
    };

    this.stations = [];
    this.filterChanged.emit({ ...this.params });
  }
}
