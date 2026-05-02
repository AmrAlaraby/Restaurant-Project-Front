import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DatePipe } from '@angular/common';

import { UsersService } from '../../../../../Core/Services/User-Service/users-service';
import { UserDetails } from '../../../../../Core/Models/UserModels/user-details';
import { TranslatePipe } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { LocalizationService } from '../../../../../Core/Services/Localization-Service/localization-service';

@Component({
  selector: 'user-details',
  standalone: true,
  imports: [DatePipe, TranslatePipe],
  templateUrl: './user-details.html',
  styleUrls: ['./user-details.scss'],
})
export class UserDetailsComponent implements OnInit {
  @Input() userId!: string;
  @Output() close = new EventEmitter<void>();

  userDetails: UserDetails | null = null;
  isLoading = true;
  errorMessage = '';

  constructor(private localizationService: LocalizationService,private usersService: UsersService) {}

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
    this.getCurrentLanguage();
  }

  CurrentLanguage: string = 'en';
    
      private destroy$ = new Subject<void>();
      getCurrentLanguage(): void {
        this.CurrentLanguage = this.localizationService.getCurrentLang();
        this.localizationService.currentLang$.pipe(takeUntil(this.destroy$)).subscribe((lang) => {
          this.CurrentLanguage = lang;
        });
      }
    
      ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
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

   getItemName(item: any): string {
    if (this.CurrentLanguage === 'ar') {
      return item.arabicName || item.name;
    }
    return item.name;
  }
}
