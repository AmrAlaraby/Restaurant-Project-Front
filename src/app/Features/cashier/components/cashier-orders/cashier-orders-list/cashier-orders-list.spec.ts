import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashierOrdersList } from './cashier-orders-list';

describe('CashierOrdersList', () => {
  let component: CashierOrdersList;
  let fixture: ComponentFixture<CashierOrdersList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CashierOrdersList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CashierOrdersList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
