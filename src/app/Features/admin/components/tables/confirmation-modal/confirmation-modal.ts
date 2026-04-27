import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';


@Component({
  selector: 'app-confirmation-modal',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './confirmation-modal.html',
  styleUrls: ['./confirmation-modal.scss'],
})
export class ConfirmationModal {
  @Input() isOpen = false;
  @Input() message = 'ADMIN.TABLES.MODAL.MESSAGE';
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
