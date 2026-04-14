import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentSelector } from './payment-selector';

describe('PaymentSelector', () => {
  let component: PaymentSelector;
  let fixture: ComponentFixture<PaymentSelector>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentSelector]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentSelector);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
