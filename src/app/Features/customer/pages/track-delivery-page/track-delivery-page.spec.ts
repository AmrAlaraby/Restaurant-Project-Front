import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackDeliveryPage } from './track-delivery-page';

describe('TrackDeliveryPage', () => {
  let component: TrackDeliveryPage;
  let fixture: ComponentFixture<TrackDeliveryPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrackDeliveryPage],
    }).compileComponents();

    fixture = TestBed.createComponent(TrackDeliveryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
