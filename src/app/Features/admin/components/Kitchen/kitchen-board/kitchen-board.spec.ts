import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KitchenBoardComponent } from './kitchen-board';

describe('KitchenBoardComponent', () => {
  let component: KitchenBoardComponent;
  let fixture: ComponentFixture<KitchenBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KitchenBoardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KitchenBoardComponent); 
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
