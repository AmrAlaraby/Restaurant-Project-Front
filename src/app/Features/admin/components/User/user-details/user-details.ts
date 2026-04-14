import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DatePipe } from '@angular/common';

import { UsersService } from '../../../../../Core/Services/User-Service/users-service';
import { UserDetails } from '../../../../../Core/Models/UserModels/user-details';

@Component({
  selector: 'user-details',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './user-details.html',
  styleUrls: ['./user-details.scss'],
})
export class UserDetailsComponent implements OnInit {
  @Input() userId!: string;
  @Output() close = new EventEmitter<void>();

  userDetails: UserDetails | null = null;
  isLoading = true;
  errorMessage = '';

  constructor(private usersService: UsersService) {}

  ngOnInit() {
    this.usersService.getUserDetails(this.userId).subscribe({
      next: (data) => {
        this.userDetails = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load user details.';
        this.isLoading = false;
        console.error(err);
      },
    });
  }

  get initials(): string {
    if (!this.userDetails?.name) return '';
    return this.userDetails.name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  }

  onClose() {
    this.close.emit();
  }
}
