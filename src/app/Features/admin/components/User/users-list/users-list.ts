import { Component, Input, Output, EventEmitter } from '@angular/core';
import { UserCard } from '../user-card/user-card';
import { User } from '../../../../../Core/Models/UserModels/user';

@Component({
  selector: 'users-list',
  standalone: true,
  imports: [UserCard],
  templateUrl: './users-list.html',
  styleUrls: ['./users-list.scss'],
})
export class UsersList {
  @Input() users: User[] = [];

  @Output() edit = new EventEmitter<User>();
  @Output() toggle = new EventEmitter<string>();
  @Output() viewDetails = new EventEmitter<User>();

  onEdit(user: User) {
    this.edit.emit(user);
  }

  onToggle(id: string) {
    this.toggle.emit(id);
  }

  onViewDetails(user: User) {
    this.viewDetails.emit(user);
  }
}
