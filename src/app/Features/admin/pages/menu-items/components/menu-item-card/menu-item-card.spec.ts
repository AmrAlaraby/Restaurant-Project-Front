import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuItemCard } from './menu-item-card';

describe('MenuItemCard', () => {
  let component: MenuItemCard;
  let fixture: ComponentFixture<MenuItemCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuItemCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuItemCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
