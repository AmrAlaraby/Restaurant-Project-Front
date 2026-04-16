import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnDeliveries } from './own-deliveries';

describe('OwnDeliveries', () => {
  let component: OwnDeliveries;
  let fixture: ComponentFixture<OwnDeliveries>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OwnDeliveries]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OwnDeliveries);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
