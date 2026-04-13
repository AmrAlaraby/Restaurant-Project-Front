import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'users-filters',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './users-filters.html',
  styleUrls: ['./users-filters.scss'],
})
export class UsersFilters {
  @Output() roleChanged = new EventEmitter<string>();
  @Output() statusChanged = new EventEmitter<boolean>();

  roles = ['All', 'Admin', 'Waiter', 'Chef', 'Driver', 'Customer'];

  selectedRole = 'All';
  isActive = true;

  selectRole(role: string) {
    this.selectedRole = role;
    this.roleChanged.emit(role);
  }

  selectStatus(status: boolean) {
    this.isActive = status;
    this.statusChanged.emit(status);
  }
}
