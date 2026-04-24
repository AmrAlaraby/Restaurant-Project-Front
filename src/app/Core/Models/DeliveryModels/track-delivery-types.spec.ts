import { TestBed } from '@angular/core/testing';

import { TrackDeliveryTypes } from './track-delivery-types';

describe('TrackDeliveryTypes', () => {
  let service: TrackDeliveryTypes;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrackDeliveryTypes);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
