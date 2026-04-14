import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'users-header',
  standalone: true,
  imports: [],
  templateUrl: './users-header.html',
  styleUrls: ['./users-header.scss'],
})
export class UsersHeader {
  @Output() addUser = new EventEmitter<void>();

  onAdd() {
    this.addUser.emit();
  }
}
