import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressPage } from './address-page';

describe('AddressPage', () => {
  let component: AddressPage;
  let fixture: ComponentFixture<AddressPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddressPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddressPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
