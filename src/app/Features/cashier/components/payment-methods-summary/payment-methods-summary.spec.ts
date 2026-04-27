import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentMethodsSummary } from './payment-methods-summary';

describe('PaymentMethodsSummary', () => {
  let component: PaymentMethodsSummary;
  let fixture: ComponentFixture<PaymentMethodsSummary>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentMethodsSummary]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentMethodsSummary);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
