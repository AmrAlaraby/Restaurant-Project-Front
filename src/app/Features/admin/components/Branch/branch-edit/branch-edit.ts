import {
  Component,
  inject,
  OnInit,
  OnChanges,
  SimpleChanges,
  signal,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BranchService } from '../../../../../Core/Services/Branch-Service/branch-service';

@Component({
  selector: 'app-branch-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './branch-edit.html',
  styleUrls: ['./branch-edit.scss'],
})
export class BranchEditComponent implements OnInit, OnChanges {
  private branchService = inject(BranchService);
  private fb = inject(FormBuilder);

  @Input({ required: true }) branchId!: number;
  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  form!: FormGroup;
  isLoading = signal(false);
  isSaving = signal(false);
  error = signal<string | null>(null);
  saveError = signal<string | null>(null);

  ngOnInit(): void {
    this.loadBranch();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['branchId'] && !changes['branchId'].firstChange) {
      this.loadBranch();
    }
  }

  loadBranch(): void {
    if (!this.branchId) return;

    this.isLoading.set(true);
    this.error.set(null);

    this.branchService.getById(this.branchId).subscribe({
      next: (branch) => {
        this.form = this.fb.group({
          name:           [branch.name,           [Validators.required]],
          phone:          [branch.phone,          [Validators.required]],
          isActive:       [branch.isActive],
          buildingNumber: [branch.buildingNumber, [Validators.required]],
          street:         [branch.street,         [Validators.required]],
          city:           [branch.city,           [Validators.required]],
          specialMark:    [branch.specialMark ?? null],
          note:           [branch.note ?? null],
        });
        this.isLoading.set(false);
      },
      error: () => {
        this.error.set('Failed to load branch data. Please try again.');
        this.isLoading.set(false);
      },
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSaving.set(true);
    this.saveError.set(null);

    this.branchService.update(this.branchId, this.form.value).subscribe({
      next: () => {
        this.isSaving.set(false);
        this.saved.emit(); // ← بس saved، من غير closed
      },
      error: () => {
        this.saveError.set('Failed to save changes. Please try again.');
        this.isSaving.set(false);
      },
    });
  }

  close(): void {
    this.closed.emit();
  }

  isInvalid(field: string): boolean {
    const ctrl = this.form?.get(field);
    return !!ctrl && ctrl.invalid && ctrl.touched;
  }
}
