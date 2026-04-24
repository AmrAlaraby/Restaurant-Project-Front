import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackDeliveryHeader } from './track-delivery-header';

describe('TrackDeliveryHeader', () => {
  let component: TrackDeliveryHeader;
  let fixture: ComponentFixture<TrackDeliveryHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrackDeliveryHeader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrackDeliveryHeader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
