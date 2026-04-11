import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuItemsGrid } from './menu-items-grid';

describe('MenuItemsGrid', () => {
  let component: MenuItemsGrid;
  let fixture: ComponentFixture<MenuItemsGrid>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuItemsGrid]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuItemsGrid);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
