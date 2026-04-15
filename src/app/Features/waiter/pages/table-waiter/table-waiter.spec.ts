import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableWaiter } from './table-waiter';

describe('TableWaiter', () => {
  let component: TableWaiter;
  let fixture: ComponentFixture<TableWaiter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableWaiter]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableWaiter);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
