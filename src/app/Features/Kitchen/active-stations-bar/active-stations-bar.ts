import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivePendingStationsDTO } from '../../../Core/Models/KitchenModels/active-pending-stations-dto';


@Component({
  selector: 'app-active-stations-bar',
  standalone: true,
  imports: [CommonModule],
templateUrl: './active-stations-bar.html',
  styleUrls: ['./active-stations-bar.scss'],   
})
export class ActiveStationsBarComponent {
  @Input() stations: ActivePendingStationsDTO[] = [];
  @Input() loading = false;
}
