import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuItemsStats } from './menu-items-stats';

describe('MenuItemsStats', () => {
  let component: MenuItemsStats;
  let fixture: ComponentFixture<MenuItemsStats>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuItemsStats]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuItemsStats);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
