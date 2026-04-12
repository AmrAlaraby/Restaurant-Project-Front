import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [RouterModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
 @Input() prefix: string = ''; // admin / cashier / etc
  @Input() isOpen = false;
  @Input() closeSidebar!: () => void;
}
