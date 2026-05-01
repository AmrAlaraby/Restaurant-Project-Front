import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAwaitingPayments } from './admin-awaiting-payments';

describe('AdminAwaitingPayments', () => {
  let component: AdminAwaitingPayments;
  let fixture: ComponentFixture<AdminAwaitingPayments>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminAwaitingPayments]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminAwaitingPayments);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
