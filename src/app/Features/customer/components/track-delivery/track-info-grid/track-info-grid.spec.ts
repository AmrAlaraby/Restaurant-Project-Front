import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackInfoGrid } from './track-info-grid';

describe('TrackInfoGrid', () => {
  let component: TrackInfoGrid;
  let fixture: ComponentFixture<TrackInfoGrid>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrackInfoGrid]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrackInfoGrid);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
