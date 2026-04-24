import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BranchAssignDeliveries } from './branch-assign-deliveries';

describe('BranchAssignDeliveries', () => {
  let component: BranchAssignDeliveries;
  let fixture: ComponentFixture<BranchAssignDeliveries>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BranchAssignDeliveries],
    }).compileComponents();

    fixture = TestBed.createComponent(BranchAssignDeliveries);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
