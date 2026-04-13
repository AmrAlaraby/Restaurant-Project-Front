import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'user-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-modal.html',
  styleUrls: ['./user-modal.scss'],
})
export class UserModal {
  @Output() close = new EventEmitter<void>();

  onClose() {
    this.close.emit();
  }
}
