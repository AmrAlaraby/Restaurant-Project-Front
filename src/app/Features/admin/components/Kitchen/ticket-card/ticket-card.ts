import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderKitchenTicketDTO } from '../../../../../Core/Models/KitchenModels/order-kitchen-ticket-dto';
import { TicketStatus } from '../../../../../Core/Models/KitchenModels/ticket-status';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { LocalizationService } from '../../../../../Core/Services/Localization-Service/localization-service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-ticket-card',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './ticket-card.html',
  styleUrls: ['./ticket-card.scss'],
})
export class TicketCardComponent implements OnInit, OnDestroy {

  constructor(
    private localizationService: LocalizationService,
    private translate: TranslateService
  ) {}

  private destroy$ = new Subject<void>();

  @Input() ticket!: OrderKitchenTicketDTO;

  @Output() statusUpdate = new EventEmitter<{ ticketId: number; status: TicketStatus }>();
  @Output() viewDetails = new EventEmitter<number>();

  TicketStatus = TicketStatus;

  CurrentLanguage: string = 'en';

  statusLabel: string = '';
  nextStatusLabel: string = '';

  ngOnInit(): void {
    this.getCurrentLanguage();
    this.updateLabels();
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
        this.updateLabels(); 
      });
  }

  updateLabels(): void {
    // 🔥 STATUS LABEL
    const statusKey = this.getStatusKey(this.ticket.status);
    this.statusLabel = this.translate.instant(`ADMIN.KITCHEN.STATUS.${statusKey}`);

    // 🔥 NEXT STATUS LABEL
    if (this.ticket.status === TicketStatus.Pending) {
      this.nextStatusLabel = this.translate.instant('ADMIN.KITCHEN.ACTIONS.START_PREPARING');
    } else if (this.ticket.status === TicketStatus.Preparing) {
      this.nextStatusLabel = this.translate.instant('ADMIN.KITCHEN.ACTIONS.MARK_DONE');
    } else {
      this.nextStatusLabel = '';
    }
  }

  getStatusKey(status: TicketStatus): string {
    switch (status) {
      case TicketStatus.Pending: return 'PENDING';
      case TicketStatus.Preparing: return 'PREPARING';
      case TicketStatus.Done: return 'DONE';
      default: return '';
    }
  }

  get nextStatus(): TicketStatus | null {
    if (this.ticket.status === TicketStatus.Pending) return TicketStatus.Preparing;
    if (this.ticket.status === TicketStatus.Preparing) return TicketStatus.Done;
    return null;
  }

  get elapsedMinutes(): number | null {
    if (!this.ticket.startedAt) return null;

    const start = new Date(this.ticket.startedAt).getTime();
    const end = this.ticket.completedAt
      ? new Date(this.ticket.completedAt).getTime()
      : Date.now();

    return Math.floor((end - start) / 60000);
  }

  onAdvance(): void {
    if (this.nextStatus !== null) {
      this.statusUpdate.emit({
        ticketId: this.ticket.id,
        status: this.nextStatus
      });
    }
  }

  onDetails(): void {
    this.viewDetails.emit(this.ticket.id);
  }
}