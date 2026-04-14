import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AddUser } from '../../../../../Core/Models/UserModels/add-user';
import { BranchDto } from '../../../../../Core/Models/BranchModels/Branch-dto';
import { UsersService } from '../../../../../Core/Services/User-Service/users-service';

@Component({
  selector: 'add-user',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './add-user.html',
  styleUrls: ['./add-user.scss'],
})
export class AddUserComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  @Output() userAdded = new EventEmitter<void>();

  roles: string[] = [];
  branches: BranchDto[] = [];

  user: AddUser = {
    name: '',
    email: '',
    roleId: '',
    branchId: undefined,
  };

  isSubmitting = false;
  errorMessage = '';

  constructor(private usersService: UsersService) {}

  ngOnInit() {
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
    if (!this.user.name || !this.user.email || !this.user.roleId) {
      this.errorMessage = 'Please fill in all required fields.';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    this.usersService.createUser(this.user).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.userAdded.emit();
        this.onClose();
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMessage = 'Failed to create user. Please try again.';
        console.error(err);
      },
    });
  }

  onClose() {
    this.close.emit();
  }
}
