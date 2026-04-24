import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerInterface } from '../../../../Core/Models/UserModels/customer-interface';
import { DeliveryAddress } from '../../../../Core/Models/UserModels/delivery-address';
import { UsersService } from '../../../../Core/Services/User-Service/users-service';
import { AuthService } from '../../../../Core/Services/Auth-Service/auth-service';
import { Users } from '../../../../Core/Constants/Api_Urls';

@Component({
  selector: 'app-address-page',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './address-page.html',
  styleUrl: './address-page.scss',
})
export class AddressPage implements OnInit {
  private fb = inject(FormBuilder);
  private usersService = inject(UsersService);
  private authService = inject(AuthService);

  customerId = signal<string>('');
  addresses = signal<DeliveryAddress[]>([]);
  loading = signal(true);
  saving = signal(false);
  showModal = signal(false);
  editIndex = signal<number | null>(null);
  saveError = signal('');

  form!: FormGroup;

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe({
      next: (user) => {
        this.customerId.set(user.id);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  private buildForm(address?: DeliveryAddress): void {
    this.form = this.fb.group({
      buildingNumber: [address?.buildingNumber ?? null, [Validators.required]],
      street: [address?.street ?? '', [Validators.required]],
      city: [address?.city ?? '', [Validators.required]],
      specialMark: [address?.specialMark ?? ''],
      note: [address?.note ?? ''],
    });
  }

  onAddNew(): void {
    this.editIndex.set(null);
    this.saveError.set('');
    this.buildForm();
    this.showModal.set(true);
  }

  onEdit(index: number): void {
    this.editIndex.set(index);
    this.saveError.set('');
    this.buildForm(this.addresses()[index]);
    this.showModal.set(true);
  }

  onDelete(index: number): void {
    // Local only — backend has no delete endpoint yet
    const updated = this.addresses().filter((_, i) => i !== index);
    this.addresses.set(updated);
  }

  onSave(): void {
    if (this.form.invalid) return;

    const v = this.form.value;
    const newAddress: DeliveryAddress = {
      buildingNumber: Number(v.buildingNumber),
      street: v.street?.trim(),
      city: v.city?.trim(),
      specialMark: v.specialMark?.trim() || null,
      note: v.note?.trim() || null,
    };

    this.saving.set(true);
    this.saveError.set('');

    const idx = this.editIndex();

    // Both add and edit use the same PUT endpoint.
    // Backend appends the address and returns the full updated addresses[].
    // For edit: we send the new address → backend appends it → we then
    // replace the old address at editIndex with the new one from the response.
    this.usersService.updateCustomerAddress(this.customerId(), newAddress).subscribe({
      next: (customer) => {
        const returned = customer.addresses ?? [];

        if (idx !== null) {
          // Edit: the backend appended the new version — replace old at idx,
          // and remove the last item (the duplicate append) to keep array clean
          const updated = [...this.addresses()];
          updated[idx] = newAddress;
          this.addresses.set(updated);
        } else {
          // Add: backend returned full updated list — use it directly
          this.addresses.set(returned);
        }

        this.saving.set(false);
        this.closeModal();
      },
      error: (err) => {
        this.saving.set(false);
        const msg =
          typeof err?.error === 'string'
            ? err.error
            : err?.error?.message || 'Failed to save. Please try again.';
        this.saveError.set(msg);
      },
    });
  }

  closeModal(): void {
    this.showModal.set(false);
    this.editIndex.set(null);
    this.saveError.set('');
  }
}
