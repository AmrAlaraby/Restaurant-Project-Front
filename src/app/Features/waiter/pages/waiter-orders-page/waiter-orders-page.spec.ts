import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WaiterOrdersPage } from './waiter-orders-page';

describe('WaiterOrdersPage', () => {
  let component: WaiterOrdersPage;
  let fixture: ComponentFixture<WaiterOrdersPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WaiterOrdersPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WaiterOrdersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
