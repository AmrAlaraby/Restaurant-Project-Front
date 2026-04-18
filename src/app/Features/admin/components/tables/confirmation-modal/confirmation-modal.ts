import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-confirmation-modal',
  standalone: true,
  templateUrl: './confirmation-modal.html',
  styleUrls: ['./confirmation-modal.scss'],
})
export class ConfirmationModal {
  @Input() isOpen = false;
  @Input() message = 'Are you sure?';
  @Input() isError = false;

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onConfirm() {
    this.confirm.emit();
  }

  onCancel() {
    this.cancel.emit();
  }
}
