import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveOrderCard } from './active-order-card';

describe('ActiveOrderCard', () => {
  let component: ActiveOrderCard;
  let fixture: ComponentFixture<ActiveOrderCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActiveOrderCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActiveOrderCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
