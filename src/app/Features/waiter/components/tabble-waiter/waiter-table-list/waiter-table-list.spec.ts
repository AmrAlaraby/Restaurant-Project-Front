import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WaiterTableList } from './waiter-table-list';

describe('WaiterTableList', () => {
  let component: WaiterTableList;
  let fixture: ComponentFixture<WaiterTableList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WaiterTableList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WaiterTableList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
