import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillPreview } from './bill-preview';

describe('BillPreview', () => {
  let component: BillPreview;
  let fixture: ComponentFixture<BillPreview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BillPreview]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BillPreview);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
