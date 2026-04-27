import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AwaitingOrdersList } from './awaiting-orders-list';

describe('AwaitingOrdersList', () => {
  let component: AwaitingOrdersList;
  let fixture: ComponentFixture<AwaitingOrdersList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AwaitingOrdersList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AwaitingOrdersList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
