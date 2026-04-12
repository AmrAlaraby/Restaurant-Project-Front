import { Component, EventEmitter, Input, Output } from '@angular/core';
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
  @Input() UserName:string ='';
  @Input() AvatarLetters:string ='';
  @Input() UserRole:string ='';
  @Output() close = new EventEmitter<void>();

  onClose() {
    this.close.emit();
  }
}
