import { Component, EventEmitter, Output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'users-header',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './users-header.html',
  styleUrls: ['./users-header.scss'],
})
export class UsersHeader {
  @Output() addUser = new EventEmitter<void>();

  onAdd() {
    this.addUser.emit();
  }
}
