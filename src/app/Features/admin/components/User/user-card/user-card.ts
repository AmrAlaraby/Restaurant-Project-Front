import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'user-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-card.html',
  styleUrls: ['./user-card.scss'],
})
export class UserCard {
  @Input() user: any;

  @Output() edit = new EventEmitter<any>();
  @Output() toggle = new EventEmitter<string>();

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
}
