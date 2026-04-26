import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AwaitingPayments } from './awaiting-payments';

describe('AwaitingPayments', () => {
  let component: AwaitingPayments;
  let fixture: ComponentFixture<AwaitingPayments>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AwaitingPayments]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AwaitingPayments);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
