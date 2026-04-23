import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChefStockPage } from './chef-stock-page';

describe('ChefStockPage', () => {
  let component: ChefStockPage;
  let fixture: ComponentFixture<ChefStockPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChefStockPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChefStockPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
