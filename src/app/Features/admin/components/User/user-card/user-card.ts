import { Component, Input, Output, EventEmitter } from '@angular/core';
import { User } from '../../../../../Core/Models/UserModels/user';


@Component({
  selector: 'user-card',
  standalone: true,
  imports: [],
  templateUrl: './user-card.html',
  styleUrls: ['./user-card.scss'],
})
export class UserCard {
  @Input() user!: User;

  @Output() edit = new EventEmitter<User>();
  @Output() toggle = new EventEmitter<string>();
  @Output() viewDetails = new EventEmitter<User>();

  get initials(): string {
    if (!this.user?.name) return '';
    return this.user.name
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .toUpperCase();
  }

  onEdit() {
    this.edit.emit(this.user);
  }

  onToggle() {
    this.toggle.emit(this.user.id);
  }

  onViewDetails() {
    this.viewDetails.emit(this.user);
  }
}
