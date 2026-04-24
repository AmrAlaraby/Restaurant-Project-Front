import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerInterface } from '../../../../Core/Models/UserModels/customer-interface';
import { DeliveryAddress } from '../../../../Core/Models/UserModels/delivery-address';
import { UsersService } from '../../../../Core/Services/User-Service/users-service';

@Component({
  selector: 'app-address-page',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './address-page.html',
  styleUrl: './address-page.scss',
})
export class AddressPage implements OnInit {
  private fb = inject(FormBuilder);
  private usersService = inject(UsersService);

  // Replace with real customer id from auth/route
  private customerId = signal<string>('');

  addresses = signal<DeliveryAddress[]>([]);
  loading = signal(true);
  saving = signal(false);
  showModal = signal(false);
  editIndex = signal<number | null>(null);
  saveError = signal('');

  form!: FormGroup;

  ngOnInit(): void {
    this.loadAddresses();
  }

  private loadAddresses(): void {
    // Addresses come from customer data — inject AuthService or pass customerId as input
    // Example: fetch current customer and read addresses array
    // this.usersService.getCustomer(id).subscribe(c => this.addresses.set(c.addresses));
    this.loading.set(false);
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
    const updated = this.addresses().filter((_, i) => i !== index);

    // Persist deletion via API — update all addresses for this customer
    // The API only has updateCustomerAddress so deletion would need a backend endpoint
    // For now update local state:
    this.addresses.set(updated);
  }

  onSave(): void {
    if (this.form.invalid) return;

    this.saving.set(true);
    this.saveError.set('');

    const v = this.form.value;
    const address: DeliveryAddress = {
      buildingNumber: Number(v.buildingNumber),
      street: v.street?.trim(),
      city: v.city?.trim(),
      specialMark: v.specialMark?.trim() || null,
      note: v.note?.trim() || null,
    };

    const idx = this.editIndex();

    if (idx !== null) {
      // Edit existing
      this.usersService.updateCustomerAddress(this.customerId(), address).subscribe({
        next: (customer: CustomerInterface) => {
          this.addresses.set(customer.addresses);
          this.saving.set(false);
          this.closeModal();
        },
        error: (err) => {
          this.saving.set(false);
          const msg =
            typeof err?.error === 'string'
              ? err.error
              : err?.error?.message || 'Something went wrong';
          this.saveError.set(msg);
        },
      });
    } else {
      // Add new — optimistic local update (add API call if backend supports it)
      const updated = [...this.addresses(), address];
      this.addresses.set(updated);
      this.saving.set(false);
      this.closeModal();
    }
  }

  closeModal(): void {
    this.showModal.set(false);
    this.editIndex.set(null);
    this.saveError.set('');
  }
}
