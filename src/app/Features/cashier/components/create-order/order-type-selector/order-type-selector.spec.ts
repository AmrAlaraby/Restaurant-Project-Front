import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderTypeSelector } from './order-type-selector';

describe('OrderTypeSelector', () => {
  let component: OrderTypeSelector;
  let fixture: ComponentFixture<OrderTypeSelector>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderTypeSelector]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderTypeSelector);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
