import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'users-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './users-header.html',
  styleUrls: ['./users-header.scss'],
})
export class UsersHeader {
  @Output() addUser = new EventEmitter<void>();

  onAdd() {
    this.addUser.emit();
  }
}
