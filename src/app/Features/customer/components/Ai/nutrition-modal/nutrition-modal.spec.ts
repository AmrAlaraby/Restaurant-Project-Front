import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NutritionModal } from './nutrition-modal';

describe('NutritionModal', () => {
  let component: NutritionModal;
  let fixture: ComponentFixture<NutritionModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NutritionModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NutritionModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
