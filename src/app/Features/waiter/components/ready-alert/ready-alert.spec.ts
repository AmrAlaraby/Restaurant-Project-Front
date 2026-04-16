import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadyAlert } from './ready-alert';

describe('ReadyAlert', () => {
  let component: ReadyAlert;
  let fixture: ComponentFixture<ReadyAlert>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReadyAlert]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReadyAlert);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
