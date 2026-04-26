import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashierPayment } from './cashier-payment';

describe('CashierPayment', () => {
  let component: CashierPayment;
  let fixture: ComponentFixture<CashierPayment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CashierPayment]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CashierPayment);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
