import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchDeliveryDetails } from './branch-delivery-details';

describe('BranchDeliveryDetails', () => {
  let component: BranchDeliveryDetails;
  let fixture: ComponentFixture<BranchDeliveryDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BranchDeliveryDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BranchDeliveryDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
