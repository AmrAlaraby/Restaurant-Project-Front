import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashierOrdersPage } from './cashier-orders-page';

describe('CashierOrdersPage', () => {
  let component: CashierOrdersPage;
  let fixture: ComponentFixture<CashierOrdersPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CashierOrdersPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CashierOrdersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
