import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersEmptyState } from './orders-empty-state';

describe('OrdersEmptyState', () => {
  let component: OrdersEmptyState;
  let fixture: ComponentFixture<OrdersEmptyState>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrdersEmptyState]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrdersEmptyState);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
