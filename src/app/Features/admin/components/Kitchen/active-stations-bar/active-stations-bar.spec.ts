import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActiveStationsBarComponent } from './active-stations-bar';

describe('ActiveStationsBarComponent', () => {
  let component: ActiveStationsBarComponent;
  let fixture: ComponentFixture<ActiveStationsBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActiveStationsBarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActiveStationsBarComponent); 
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
