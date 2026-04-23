import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersHeader } from './orders-header';

describe('OrdersHeader', () => {
  let component: OrdersHeader;
  let fixture: ComponentFixture<OrdersHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrdersHeader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrdersHeader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
