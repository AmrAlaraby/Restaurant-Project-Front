import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stats-cards',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stats-cards.html',
  styleUrl: './stats-cards.scss'
})
export class StatsCardsComponent {

  @Input() occupied = 0;
  @Input() orders = 0;

}