import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchStock } from './branch-stock';

describe('BranchStock', () => {
  let component: BranchStock;
  let fixture: ComponentFixture<BranchStock>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BranchStock]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BranchStock);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
