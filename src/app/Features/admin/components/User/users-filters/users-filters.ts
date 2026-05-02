import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BranchDto } from '../../../../../Core/Models/BranchModels/Branch-dto';
import { UsersService } from '../../../../../Core/Services/User-Service/users-service';
import { TranslatePipe } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { LocalizationService } from '../../../../../Core/Services/Localization-Service/localization-service';


@Component({
  selector: 'users-filters',
  standalone: true,
  imports: [FormsModule,TranslatePipe],
  templateUrl: './users-filters.html',
  styleUrls: ['./users-filters.scss'],
})
export class UsersFilters implements OnInit {
  @Output() roleChanged = new EventEmitter<string>();
  @Output() statusChanged = new EventEmitter<boolean>();
  @Output() branchChanged = new EventEmitter<number | null>();

  roles: string[] = [];
  branches: BranchDto[] = [];

  selectedRole = 'All';
  selectedBranchId: number | null = null;
  isActive = true;

  constructor(private localizationService: LocalizationService,private usersService: UsersService) {}

  ngOnInit() {
    this.usersService.getRoles().subscribe({
      next: (roles) => (this.roles = ['All', ...roles]),
      error: (err) => console.error('Failed to load roles', err),
    });

    this.usersService.getBranches().subscribe({
      next: (branches) => (this.branches = branches),
      error: (err) => console.error('Failed to load branches', err),
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

  selectRole(role: string) {
    this.selectedRole = role;
    this.roleChanged.emit(role);
  }

  selectBranch(branchId: number | null) {
    this.selectedBranchId = branchId;
    this.branchChanged.emit(branchId);
  }

  selectStatus(status: boolean) {
    this.isActive = status;
    this.statusChanged.emit(status);
  }
  getItemName(item: any): string {
    if (this.CurrentLanguage === 'ar') {
      return item.arabicName || item.name;
    }
    return item.name;
  }
}
