import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-payment-selector',
  imports: [TranslatePipe],
  templateUrl: './payment-selector.html',
  styleUrl: './payment-selector.scss',
})
export class PaymentSelector {
  @Input() method: string = 'Cash';
  @Output() methodChange = new EventEmitter<string>();

  select(method: string): void {
    this.methodChange.emit(method);
  }
}
