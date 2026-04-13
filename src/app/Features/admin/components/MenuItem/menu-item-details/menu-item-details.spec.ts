import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuItemDetails } from './menu-item-details';

describe('MenuItemDetails', () => {
  let component: MenuItemDetails;
  let fixture: ComponentFixture<MenuItemDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuItemDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuItemDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
