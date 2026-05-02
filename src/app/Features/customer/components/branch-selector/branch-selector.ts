import { Component } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Observable, Subject, takeUntil } from 'rxjs';
import { BranchDto } from '../../../../Core/Models/BranchModels/Branch-dto';
import { BranchStateService } from '../../../../Core/Services/Branch-Service/branch-state-service';
import { LocalizationService } from '../../../../Core/Services/Localization-Service/localization-service';

@Component({
  selector: 'app-branch-selector',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './branch-selector.html',
  styleUrl: './branch-selector.scss'
})
export class BranchSelector {

  branches$!: Observable<BranchDto[]>;
  selected$!: Observable<BranchDto | null>;

  isOpen = false;

  constructor(private localizationService: LocalizationService,private branchState: BranchStateService) { }

  ngOnInit() {
    this.branches$ = this.branchState.branches$;
    this.selected$ = this.branchState.selectedBranch$;
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

  toggle() {
    this.isOpen = !this.isOpen;
  }

  select(branch: BranchDto) {
    this.branchState.selectBranch(branch);
    this.isOpen = false;

  
  }
  getItemName(item: any): string {
    if (this.CurrentLanguage === 'ar') {
      return item.arabicName || item.name;
    }
    return item.name;
  }
}