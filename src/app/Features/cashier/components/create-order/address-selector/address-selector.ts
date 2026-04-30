import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DeliveryAddress } from './../../../../../Core/Models/UserModels/delivery-address';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-address-selector',
  imports: [CommonModule, FormsModule, TranslatePipe],
  templateUrl: './address-selector.html',
  styleUrl: './address-selector.scss',
})
export class AddressSelector {
  @Input() addresses: DeliveryAddress[] = [];
  @Input() selected?: DeliveryAddress;

  @Output() select = new EventEmitter<DeliveryAddress>();
  @Output() add = new EventEmitter<DeliveryAddress>();

  showForm = false;

  // form
  address: DeliveryAddress = {
    buildingNumber: 0,
    street: '',
    city: '',
    note: '',
    specialMark: ''
  };

  selectAddress(a: DeliveryAddress) {
    this.select.emit(a);
  }

  openForm() {
    this.showForm = true;
  }

  save() {
    this.add.emit(this.address);

    this.address = {
      buildingNumber: 0,
      street: '',
      city: '',
      note: '',
      specialMark: ''
    };

    this.showForm = false;
  }
}
