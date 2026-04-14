import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WaiterOrderFilters } from './waiter-order-filters';

describe('WaiterOrderFilters', () => {
  let component: WaiterOrderFilters;
  let fixture: ComponentFixture<WaiterOrderFilters>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WaiterOrderFilters]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WaiterOrderFilters);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
