import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChefKitchenFilterComponent } from './chef-kitchen-filter';

describe('ChefKitchenFilterComponent', () => {
  let component: ChefKitchenFilterComponent;
  let fixture: ComponentFixture<ChefKitchenFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChefKitchenFilterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChefKitchenFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
