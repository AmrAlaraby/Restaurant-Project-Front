import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChefLowStock } from './chef-low-stock';

describe('ChefLowStock', () => {
  let component: ChefLowStock;
  let fixture: ComponentFixture<ChefLowStock>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChefLowStock]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChefLowStock);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
