import { Component, inject, signal, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BranchService } from '../../../../../Core/Services/Branch-Service/branch-service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-branch-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,TranslatePipe],
  templateUrl: './branch-create.html',
  styleUrls: ['./branch-create.scss'],
})
export class BranchCreateComponent {
  private branchService = inject(BranchService);
  private fb = inject(FormBuilder);

  @Output() closed = new EventEmitter<void>();
  @Output() created = new EventEmitter<void>();

  isSaving = signal(false);
  saveError = signal<string | null>(null);

  form: FormGroup = this.fb.group({
    name:           ['', [Validators.required]],
    phone:          ['', [Validators.required]],
    buildingNumber: [null, [Validators.required]],
    street:         ['', [Validators.required]],
    city:           ['', [Validators.required]],
    specialMark:    [null],
    note:           [null],
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSaving.set(true);
    this.saveError.set(null);

    this.branchService.create(this.form.value).subscribe({
      next: () => {
        this.isSaving.set(false);
        this.created.emit();
        this.closed.emit();
      },
      error: () => {
        this.saveError.set('Failed to create branch. Please try again.');
        this.isSaving.set(false);
      },
    });
  }

  close(): void {
    this.closed.emit();
  }

  isInvalid(field: string): boolean {
    const ctrl = this.form.get(field);
    return !!ctrl && ctrl.invalid && ctrl.touched;
  }
}
