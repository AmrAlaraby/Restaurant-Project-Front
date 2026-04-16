import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableInterface } from '../../../../Core/Models/TableModels/table-interface';

@Component({
  selector: 'app-tables-grid',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tables-grid.html',
  styleUrl: './tables-grid.scss'
})
export class TablesGridComponent {

  @Input() tables: TableInterface[] = [];

}