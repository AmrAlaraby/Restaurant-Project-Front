import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomTableModal } from './custom-table-modal';

describe('CustomTableModal', () => {
  let component: CustomTableModal;
  let fixture: ComponentFixture<CustomTableModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomTableModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomTableModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
