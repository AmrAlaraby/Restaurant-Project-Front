import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UpdateCustomerAddressDTO } from '../../../../../../Core/Models/UserModels/update-customer-address-dto';
import { AuthService } from '../../../../../../Core/Services/Auth-Service/auth-service';

@Component({
  selector: 'app-add-address-modal',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './add-address-modal.html',
  styleUrl: './add-address-modal.scss'
})
export class AddAddressModal {

  @Output() closed = new EventEmitter<void>();
  @Output() addressAdded = new EventEmitter<void>();

  loading = false;

  form = {
    buildingNumber: null as number | null,
    street: '',
    city: '',
    note: '',
    specialMark: ''
  };

  constructor(private authService: AuthService) {}

  close() {
    this.closed.emit();
  }

  submit() {
    if (!this.form.buildingNumber || !this.form.street || !this.form.city) {
      alert('Building number, street and city are required');
      return;
    }

    this.loading = true;

    this.authService.getCurrentUser().subscribe({
      next: (user) => {

        const dto: UpdateCustomerAddressDTO = {
          addressDTO: {
            buildingNumber: this.form.buildingNumber!,
            street: this.form.street,
            city: this.form.city,
            note: this.form.note || undefined,
            specialMark: this.form.specialMark || undefined
          }
        };

        this.authService.addUserAddress(user.id, dto).subscribe({
          next: () => {
            this.loading = false;
            this.addressAdded.emit();
            this.close();
          },
          error: (err) => {
            console.error(err);
            this.loading = false;
            alert('Failed to add address');
          }
        });
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        alert('Failed to get user');
      }
    });
  }
}
