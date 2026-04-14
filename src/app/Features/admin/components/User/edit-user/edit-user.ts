import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '../../../../../Core/Models/UserModels/user';
import { BranchDto } from '../../../../../Core/Models/BranchModels/Branch-dto';
import { UsersService } from '../../../../../Core/Services/User-Service/users-service';

@Component({
  selector: 'edit-user',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './edit-user.html',
  styleUrls: ['./edit-user.scss'],
})
export class EditUserComponent implements OnInit {
  @Input() user!: User;

  @Output() close = new EventEmitter<void>();
  @Output() userUpdated = new EventEmitter<void>();

  roles: string[] = [];
  branches: BranchDto[] = [];

  editedUser = {
    id: '',
    name: '',
    email: '',
    roleId: '',
    branchId: undefined as number | undefined,
  };

  isSubmitting = false;
  errorMessage = '';

  constructor(private usersService: UsersService) {}

  ngOnInit() {
    // نسخ بيانات الـ user الحالي في الفورم
    this.editedUser = {
      id: this.user.id,
      name: this.user.name,
      email: this.user.email,
      roleId: this.user.roleId,
      branchId: this.user.branchId ?? undefined,
    };

    this.usersService.getRoles().subscribe({
      next: (roles) => (this.roles = roles),
      error: (err) => console.error('Failed to load roles', err),
    });

    this.usersService.getBranches().subscribe({
      next: (branches) => (this.branches = branches),
      error: (err) => console.error('Failed to load branches', err),
    });
  }

  onSave() {
    if (!this.editedUser.name || !this.editedUser.email || !this.editedUser.roleId) {
      this.errorMessage = 'Please fill in all required fields.';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    this.usersService.updateUser(this.editedUser).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.userUpdated.emit();
        this.onClose();
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMessage = 'Failed to update user. Please try again.';
        console.error(err);
      },
    });
  }

  onClose() {
    this.close.emit();
  }
}
