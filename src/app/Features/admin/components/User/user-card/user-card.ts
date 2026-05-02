import { Component, Input, Output, EventEmitter } from '@angular/core';
import { User } from '../../../../../Core/Models/UserModels/user';
import { Subject, takeUntil } from 'rxjs';
import { LocalizationService } from '../../../../../Core/Services/Localization-Service/localization-service';
import { TranslatePipe } from '@ngx-translate/core';


@Component({
  selector: 'user-card',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './user-card.html',
  styleUrls: ['./user-card.scss'],
})
export class UserCard {
  @Input() user!: User;

  @Output() edit = new EventEmitter<User>();
  @Output() toggle = new EventEmitter<string>();
  @Output() viewDetails = new EventEmitter<User>();

  constructor(
        private localizationService: LocalizationService,
      ) {}
    ngOnInit(): void {
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
    if (!this.user?.name) return '';
    return this.user.name
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .toUpperCase();
  }

  onEdit() {
    this.edit.emit(this.user);
  }

  onToggle() {
    this.toggle.emit(this.user.id);
  }

  onViewDetails() {
    this.viewDetails.emit(this.user);
  }

  getbranchName(item: any): string {
    if (this.CurrentLanguage === 'ar') {
      return item.branchArabicName || item.branchName;
    }
    return item.branchName;
  }
}
