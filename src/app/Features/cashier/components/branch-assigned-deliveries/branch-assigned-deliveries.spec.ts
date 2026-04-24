import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchAssignedDeliveries } from './branch-assigned-deliveries';

describe('BranchAssignedDeliveries', () => {
  let component: BranchAssignedDeliveries;
  let fixture: ComponentFixture<BranchAssignedDeliveries>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BranchAssignedDeliveries]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BranchAssignedDeliveries);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
