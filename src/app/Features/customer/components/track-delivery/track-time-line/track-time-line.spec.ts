import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackTimeline } from './track-time-line';


describe('TrackTimeline', () => {
  let component: TrackTimeline;
  let fixture: ComponentFixture<TrackTimeline>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrackTimeline]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrackTimeline);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
