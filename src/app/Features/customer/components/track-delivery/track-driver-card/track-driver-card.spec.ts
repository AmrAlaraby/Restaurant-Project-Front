import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackDriverCard } from './track-driver-card';

describe('TrackDriverCard', () => {
  let component: TrackDriverCard;
  let fixture: ComponentFixture<TrackDriverCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrackDriverCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrackDriverCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
