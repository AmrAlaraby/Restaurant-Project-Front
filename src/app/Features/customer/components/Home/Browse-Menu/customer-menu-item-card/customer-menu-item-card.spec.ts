import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerMenuItemCard } from './customer-menu-item-card';

describe('CustomerMenuItemCard', () => {
  let component: CustomerMenuItemCard;
  let fixture: ComponentFixture<CustomerMenuItemCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerMenuItemCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerMenuItemCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
