import { Component, EventEmitter, Input, Output, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KitchenTicketDetailsDto } from '../../../../../Core/Models/KitchenModels/kitchen-ticket-details-dto';
import { TicketStatus } from '../../../../../Core/Models/KitchenModels/ticket-status';
import { TranslatePipe } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { LocalizationService } from '../../../../../Core/Services/Localization-Service/localization-service';

@Component({
  selector: 'app-ticket-details-modal',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './ticket-details.html',
  styleUrls: ['./ticket-details.scss'],
})
export class TicketDetailsModalComponent implements OnInit, OnDestroy {

  @Input() ticket!: KitchenTicketDetailsDto;

  @Output() close = new EventEmitter<void>();
  @Output() statusUpdate = new EventEmitter<{ ticketId: number; status: TicketStatus }>();

  private destroy$ = new Subject<void>();

  CurrentLanguage: string = 'en';
  TicketStatus = TicketStatus;

  constructor(private localizationService: LocalizationService) {}

  ngOnInit(): void {
    this.getCurrentLanguage();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getCurrentLanguage(): void {
    this.CurrentLanguage = this.localizationService.getCurrentLang();

    this.localizationService.currentLang$
      .pipe(takeUntil(this.destroy$))
      .subscribe(lang => {
        this.CurrentLanguage = lang;
      });
  }

  // =========================
  // ✅ NO STATIC TEXT HERE
  // =========================

  get statusLabelKey(): string {
    switch (this.ticket.status) {
      case TicketStatus.Pending:
        return 'ADMIN.KITCHEN.STATUS.PENDING';
      case TicketStatus.Preparing:
        return 'ADMIN.KITCHEN.STATUS.PREPARING';
      case TicketStatus.Done:
        return 'ADMIN.KITCHEN.STATUS.DONE';
      default:
        return '';
    }
  }

  get nextStatus(): TicketStatus | null {
    if (this.ticket.status === TicketStatus.Pending) return TicketStatus.Preparing;
    if (this.ticket.status === TicketStatus.Preparing) return TicketStatus.Done;
    return null;
  }

  get nextStatusLabelKey(): string {
    if (this.ticket.status === TicketStatus.Pending)
      return 'ADMIN.KITCHEN.ACTIONS.START_PREPARING';

    if (this.ticket.status === TicketStatus.Preparing)
      return 'ADMIN.KITCHEN.ACTIONS.MARK_DONE';

    return '';
  }

  onAdvance(): void {
    if (this.nextStatus !== null) {
      this.statusUpdate.emit({
        ticketId: this.ticket.id,
        status: this.nextStatus
      });
    }
  }

  onClose(): void {
    this.close.emit();
  }

  getItemsNames(item: any): string[] {
    if (this.CurrentLanguage === 'ar') {
     return item.arabicItems || item.items;
    }
    return item.items;
  }
}