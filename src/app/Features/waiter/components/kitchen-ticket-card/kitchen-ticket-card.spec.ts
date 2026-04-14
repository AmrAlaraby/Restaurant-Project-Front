import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KitchenTicketCard } from './kitchen-ticket-card';

describe('KitchenTicketCard', () => {
  let component: KitchenTicketCard;
  let fixture: ComponentFixture<KitchenTicketCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KitchenTicketCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KitchenTicketCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
