import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WaiterOrdersList } from './waiter-orders-list';

describe('WaiterOrdersList', () => {
  let component: WaiterOrdersList;
  let fixture: ComponentFixture<WaiterOrdersList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WaiterOrdersList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WaiterOrdersList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
