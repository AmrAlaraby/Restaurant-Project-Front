import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserCard } from '../user-card/user-card';

@Component({
  selector: 'users-list',
  standalone: true,
  imports: [CommonModule, UserCard],
  templateUrl: './users-list.html',
  styleUrls: ['./users-list.scss'],
})
export class UsersList {
  @Input() users: any[] = [];

  @Output() edit = new EventEmitter<any>();
  @Output() toggle = new EventEmitter<string>();

  onEdit(user: any) {
    this.edit.emit(user);
  }

  onToggle(id: string) {
    this.toggle.emit(id);
  }
}
