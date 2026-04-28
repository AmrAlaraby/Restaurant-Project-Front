import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentMethodsSummaryComponent } from './payment-methods-summary';

describe('PaymentMethodsSummaryComponent', () => {
  let component: PaymentMethodsSummaryComponent;
  let fixture: ComponentFixture<PaymentMethodsSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentMethodsSummaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentMethodsSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
