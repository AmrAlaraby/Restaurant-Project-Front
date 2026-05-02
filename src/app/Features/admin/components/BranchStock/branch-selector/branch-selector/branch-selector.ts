import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BranchService } from '../../../../../../Core/Services/Branch-Service/branch-service';
import { ToastService } from '../../../../../../Core/Services/Toast-Service/toast-service';
import { Subject, takeUntil } from 'rxjs';
import { LocalizationService } from '../../../../../../Core/Services/Localization-Service/localization-service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-branch-selector',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './branch-selector.html',
  styleUrls: ['./branch-selector.scss']
})
export class BranchSelectorComponent implements OnInit {

  branches: any[] = [];
  selectedBranchId: number | null = null;

  @Output() branchChanged = new EventEmitter<number>();

  constructor(private branchService: BranchService,
            private localizationService: LocalizationService,
            private toast: ToastService
  ) {}

 
   ngOnInit(): void {
    this.branchService.getBranches().subscribe({
      next: (res) => this.branches = res,
      error: () => this.toast.error('Failed to load branches') 
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

  selectBranch(id: number) {
    this.selectedBranchId = id;
    this.branchChanged.emit(id);
  }
  getBranchName(item: any): string {
    if (this.CurrentLanguage === 'ar') {
      return item.arabicName || item.branchName;
    }
    return item.branchName;
  }
}