import {
  Component,
  Input,
  Output,
  EventEmitter,
  inject,
  OnChanges,
  SimpleChanges,
  OnInit,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TableInterface } from '../../../../../Core/Models/TableModels/table-interface';
import { BranchService } from '../../../../../Core/Services/Branch-Service/branch-service';
import { Branch } from '../../../../../Core/Models/BranchModels/branch-interface';

@Component({
  selector: 'app-custom-table-modal',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './custom-table-modal.html',
  styleUrls: ['./custom-table-modal.scss'],
})
export class CustomTableModal implements OnChanges, OnInit {
  private fb = inject(FormBuilder);

  @Input() isOpen = false;
  @Input() isEdit = false;

  @Input() table: TableInterface | null = null;

  @Output() close = new EventEmitter<void>();

  @Output() save = new EventEmitter<{
    tableNumber: string;
    capacity: number;
    branchId: number;
  }>();

  branches: Branch[] = [];
  private branchService = inject(BranchService);
  form = this.fb.nonNullable.group({
    tableNumber: ['', [Validators.required, Validators.pattern(/^T\d{2,3}$/)]],
    capacity: [0, [Validators.required, Validators.min(1), Validators.max(20)]],
    branchId: [0, Validators.required],
  });

  ngOnInit(): void {
    this.branchService.getBranches().subscribe({
      next: (res) => (this.branches = res),
      error: (err) => console.error(err),
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['table']) {
      if (this.table) {
        // 🔵 Edit
        this.form.patchValue({
          tableNumber: this.table.tableNumber,
          capacity: this.table.capacity,
          branchId: this.table.branchId,
        });
      } else {
        // 🟢 Create
        this.form.reset({
          tableNumber: '',
          capacity: 0,
          branchId: 0,
        });
      }
    }
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    this.save.emit(value);
  }
  

  onClose() {
    this.close.emit();

    this.form.reset({
      tableNumber: '',
      capacity: 0,
      branchId: 0,
    });
  }
  
}
