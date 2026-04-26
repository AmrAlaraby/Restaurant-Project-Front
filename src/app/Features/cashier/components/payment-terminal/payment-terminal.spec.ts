import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentTerminal } from './payment-terminal';

describe('PaymentTerminal', () => {
  let component: PaymentTerminal;
  let fixture: ComponentFixture<PaymentTerminal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentTerminal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentTerminal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
