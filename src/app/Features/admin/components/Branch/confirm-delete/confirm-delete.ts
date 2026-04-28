import {
  Component,
  Input,
  Output,
  EventEmitter,
  signal,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { BranchService } from '../../../../../Core/Services/Branch-Service/branch-service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-confirm-delete',
  standalone: true,
  imports: [CommonModule,TranslatePipe],
  templateUrl: './confirm-delete.html',
  styleUrls: ['./confirm-delete.scss'],
})
export class ConfirmDeleteComponent {
  private branchService = inject(BranchService);

  @Input({ required: true }) branchId!: number;
  @Input({ required: true }) branchName!: string;

  @Output() cancelled = new EventEmitter<void>();
  @Output() deleted = new EventEmitter<void>();

  isDeleting = signal(false);
  deleteError = signal<string | null>(null);

  confirm(): void {
    this.isDeleting.set(true);
    this.deleteError.set(null);

    this.branchService.delete(this.branchId).subscribe({
      next: () => {
        this.isDeleting.set(false);
        this.deleted.emit();
      },
      error: () => {
        this.deleteError.set('Failed to delete branch. Please try again.');
        this.isDeleting.set(false);
      },
    });
  }

  cancel(): void {
    this.cancelled.emit();
  }

  onOverlayClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('confirm-overlay')) {
      this.cancel();
    }
  }
}
