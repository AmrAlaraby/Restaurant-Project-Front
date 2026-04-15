import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChefKitchenBoardComponent } from './chef-kitchen-board';

describe('ChefKitchenBoardComponent', () => {
  let component: ChefKitchenBoardComponent;
  let fixture: ComponentFixture<ChefKitchenBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChefKitchenBoardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChefKitchenBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
