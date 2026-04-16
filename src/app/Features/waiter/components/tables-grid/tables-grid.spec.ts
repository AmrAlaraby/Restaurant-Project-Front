import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablesGrid } from './tables-grid';

describe('TablesGrid', () => {
  let component: TablesGrid;
  let fixture: ComponentFixture<TablesGrid>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TablesGrid]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TablesGrid);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
