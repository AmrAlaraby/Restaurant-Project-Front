import {
  Component,
  OnInit,
  OnDestroy,
  inject,
  signal,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
} from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { AddCustomerAddressDto } from '../../../../../Core/Models/AddressModels/add-customer-address-dto';
import { DeleteAddressDto } from '../../../../../Core/Models/AddressModels/delete-address-dto';
import { UpdateAddressDto } from '../../../../../Core/Models/AddressModels/update-address-dto';
import { AddressDto } from '../../../../../Core/Models/AuthModels/address-dto';
import { AddressService } from '../../../../../Core/Services/Address-Service/address';



// TODO: replace with your actual auth service
const MOCK_USER_ID = '04346712-56ff-4baa-9a5a-f71342967fc5';

type ModalMode = 'add' | 'edit' | null;

@Component({
  selector: 'app-saved-addresses',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './saved-addresses.html',
  styleUrls: ['./saved-addresses.scss'],
})
export class SavedAddressesComponent implements OnInit, OnDestroy {
  private svc = inject(AddressService);
  private fb  = inject(FormBuilder);
  private destroy$ = new Subject<void>();
  private searchSubject$ = new Subject<string>();

  // ── data ──────────────────────────────────────────────
  /** All addresses fetched (latest-first order maintained here) */
  private allAddresses = signal<AddressDto[]>([]);

  /** addresses after client-side search filter */
  filteredAddresses = computed(() => {
    const q = this.searchQuery().trim().toLowerCase();
    if (!q) return this.allAddresses();
    return this.allAddresses().filter((a) =>
      `${a.buildingNumber} ${a.street} ${a.city} ${a.note ?? ''} ${a.specialMark ?? ''}`
        .toLowerCase()
        .includes(q),
    );
  });

  /** current page slice */
  pagedAddresses = computed(() => {
    const start = (this.pageIndex() - 1) * this.pageSize();
    return this.filteredAddresses().slice(start, start + this.pageSize());
  });

  totalPages = computed(() =>
    Math.max(1, Math.ceil(this.filteredAddresses().length / this.pageSize())),
  );

  // ── ui state ──────────────────────────────────────────
  loading  = signal(false);
  saving   = signal(false);
  deleting = signal<string | null>(null);

  modalMode      = signal<ModalMode>(null);
  editingAddress = signal<AddressDto | null>(null);

  // ── confirm delete ────────────────────────────────────
  private _addressToDelete = signal<AddressDto | null>(null);
  addressToDelete = this._addressToDelete.asReadonly();

  confirmDelete(addr: AddressDto) { this._addressToDelete.set(addr); }
  cancelDelete()                  { this._addressToDelete.set(null); }

  searchQuery = signal('');
  pageIndex   = signal(1);
  pageSize    = signal(5);

  form!: FormGroup;
  userId = MOCK_USER_ID;
  Math = Math; // expose to template

  // ── lifecycle ─────────────────────────────────────────
  ngOnInit() {
    this.buildForm();
    this.loadAddresses();

    // debounce search input → 300 ms
    this.searchSubject$
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((q) => {
        this.searchQuery.set(q);
        this.pageIndex.set(1); // reset to first page on new search
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ── form ──────────────────────────────────────────────
  buildForm() {
    this.form = this.fb.group({
      buildingNumber: [null, [Validators.required, Validators.min(1)]],
      street:         ['', Validators.required],
      city:           ['', Validators.required],
      note:           [''],
      specialMark:    [''],
    });
  }

  // ── data loading ──────────────────────────────────────
  loadAddresses() {
    this.loading.set(true);
    // fetch a large page so client-side search/sort covers all records
    this.svc.getMyAddresses(1, 100).subscribe({
      next: (res) => {
        // reverse → latest added appears first
        this.allAddresses.set([...res.data].reverse());
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  // ── search ────────────────────────────────────────────
  onSearchInput(value: string) {
    this.searchSubject$.next(value);
  }

  clearSearch() {
    this.searchQuery.set('');
    this.pageIndex.set(1);
  }

  // ── pagination ────────────────────────────────────────
  goToPage(page: number) {
    if (page < 1 || page > this.totalPages()) return;
    this.pageIndex.set(page);
  }

  pageNumbers = computed(() => {
    const total = this.totalPages();
    const current = this.pageIndex();
    const pages: (number | '...')[] = [];

    if (total <= 7) {
      for (let i = 1; i <= total; i++) pages.push(i);
      return pages;
    }

    pages.push(1);
    if (current > 3) pages.push('...');
    for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
      pages.push(i);
    }
    if (current < total - 2) pages.push('...');
    pages.push(total);
    return pages;
  });

  // ── modal ─────────────────────────────────────────────
  openAdd() {
    this.editingAddress.set(null);
    this.form.reset();
    this.modalMode.set('add');
  }

  openEdit(addr: AddressDto) {
    this.editingAddress.set(addr);
    this.form.patchValue(addr);
    this.modalMode.set('edit');
  }

  closeModal() {
    this.modalMode.set(null);
    this.editingAddress.set(null);
    this.form.reset();
  }

  // ── submit ────────────────────────────────────────────
  submitForm() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const val = this.form.value;
    this.saving.set(true);

    if (this.modalMode() === 'add') {
      const dto: AddCustomerAddressDto = { addressDTO: val };
      this.svc.addAddress(this.userId, dto).subscribe({
        next: () => { this.saving.set(false); this.closeModal(); this.loadAddresses(); },
        error: () => this.saving.set(false),
      });
    } else {
      const old = this.editingAddress()!;
      const dto: UpdateAddressDto = {
        oldBuildingNumber: old.buildingNumber,
        oldStreet: old.street,
        oldCity: old.city,
        ...val,
      };
      this.svc.updateAddress(this.userId, dto).subscribe({
        next: () => { this.saving.set(false); this.closeModal(); this.loadAddresses(); },
        error: () => this.saving.set(false),
      });
    }
  }

  // ── delete ────────────────────────────────────────────
  deleteAddress(addr: AddressDto) {
    const key = `${addr.buildingNumber}-${addr.street}`;
    this.deleting.set(key);
    const dto: DeleteAddressDto = {
      buildingNumber: addr.buildingNumber,
      street: addr.street,
      city: addr.city,
    };
    this.svc.deleteAddress(this.userId, dto).subscribe({
      next: () => { this.deleting.set(null); this._addressToDelete.set(null); this.loadAddresses(); },
      error: () => this.deleting.set(null),
    });
  }

  isDeleting(addr: AddressDto) {
    return this.deleting() === `${addr.buildingNumber}-${addr.street}`;
  }

  // ── helpers ───────────────────────────────────────────
  hasError(field: string, error: string) {
    const c = this.form.get(field);
    return c?.touched && c?.hasError(error);
  }

  trackByAddr(_: number, addr: AddressDto) {
    return `${addr.buildingNumber}-${addr.street}-${addr.city}`;
  }
}
