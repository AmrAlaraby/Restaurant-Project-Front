import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChefAvailableStock } from './chef-available-stock';

describe('ChefAvailableStock', () => {
  let component: ChefAvailableStock;
  let fixture: ComponentFixture<ChefAvailableStock>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChefAvailableStock]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChefAvailableStock);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
