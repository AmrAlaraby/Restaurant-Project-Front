import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuItemsFilters } from './menu-items-filters';

describe('MenuItemsFilters', () => {
  let component: MenuItemsFilters;
  let fixture: ComponentFixture<MenuItemsFilters>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuItemsFilters]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuItemsFilters);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
