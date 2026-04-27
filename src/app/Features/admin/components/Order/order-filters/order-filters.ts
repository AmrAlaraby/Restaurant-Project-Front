import { Component, EventEmitter, Input, NgModule, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BranchDto } from '../../../../../Core/Models/BranchModels/Branch-dto';
import { TranslatePipe } from '@ngx-translate/core';
import { LocalizationService } from '../../../../../Core/Services/Localization-Service/localization-service';


@Component({
  selector: 'app-order-filters',
  imports: [FormsModule,TranslatePipe],
  templateUrl: './order-filters.html',
  styleUrl: './order-filters.scss',
})
export class OrderFilters implements OnInit {
  CurrentLanguage: string = 'en';
  constructor(private localizationService:LocalizationService) {}
  ngOnInit(): void {
    this.getCurrentLanguage();
    
  }
  getCurrentLanguage(): void {
    this.CurrentLanguage = this.localizationService.getCurrentLang();
    this.localizationService.currentLang$
    .subscribe(lang => {
      this.CurrentLanguage = lang;
    });
  }
  @Input() branches : BranchDto[] = [];
  @Output() filterChange = new EventEmitter();

  filters: any = {
    Ordertype: '',
    status: '',
    branchId: ''
  };

  emit() {
    this.filterChange.emit(this.filters);
  }
  getBranchName(item: any): string {
    if (this.CurrentLanguage === 'ar') {
     return item.arabicName || item.name;
    }
    return item.name;
  }
}
