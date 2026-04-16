import { Component } from '@angular/core';

@Component({
  selector: 'app-tables-grid',
  standalone: true,  // Important for standalone components
  templateUrl: './tables-grid.html',
  styleUrls: ['./tables-grid.scss']
})
export class TablesGrid {
  tables = [
    { tableNumber: 1, isOccupied: false, capacity: 4 },
    // ... more tables
  ];
}