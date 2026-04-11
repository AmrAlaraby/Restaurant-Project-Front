import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderPagination } from './order-pagination';

describe('OrderPagination', () => {
  let component: OrderPagination;
  let fixture: ComponentFixture<OrderPagination>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderPagination]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderPagination);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
