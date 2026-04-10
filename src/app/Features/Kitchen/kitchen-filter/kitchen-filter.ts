import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivePendingStationsDTO } from '../../../Core/Models/KitchenModels/active-pending-stations-dto';
import { KitchenTicketQueryParams } from '../../../Core/Models/KitchenModels/kitchen-ticket-query-params';
import { TicketStatus } from '../../../Core/Models/KitchenModels/ticket-status';


@Component({
  selector: 'app-kitchen-filter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './kitchen-filter.html',
  styleUrls: ['./kitchen-filter.scss'],
})
export class KitchenFilterComponent implements OnInit {
  @Input() stations: ActivePendingStationsDTO[] = [];
  @Output() filterChanged = new EventEmitter<KitchenTicketQueryParams>();

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

  ngOnInit(): void {}

  onApply(): void {
    this.filterChanged.emit({ ...this.params });
  }

  onReset(): void {
    this.params = { branchId: null, orderId: null, station: null, status: null };
    this.filterChanged.emit({ ...this.params });
  }
}
