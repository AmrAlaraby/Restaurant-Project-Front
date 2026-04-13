import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllDeliveries } from './all-deliveries';

describe('AllDeliveries', () => {
  let component: AllDeliveries;
  let fixture: ComponentFixture<AllDeliveries>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllDeliveries]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllDeliveries);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
