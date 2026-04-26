import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiSuggest } from './ai-suggest';

describe('AiSuggest', () => {
  let component: AiSuggest;
  let fixture: ComponentFixture<AiSuggest>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AiSuggest]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AiSuggest);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
