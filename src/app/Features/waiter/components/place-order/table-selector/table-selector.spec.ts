import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableSelector } from './table-selector';

describe('TableSelector', () => {
  let component: TableSelector;
  let fixture: ComponentFixture<TableSelector>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableSelector]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableSelector);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
