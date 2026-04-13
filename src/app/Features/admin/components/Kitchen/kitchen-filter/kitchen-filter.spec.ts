import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KitchenFilterComponent } from './kitchen-filter';

describe('KitchenFilterComponent', () => {
  let component: KitchenFilterComponent;
  let fixture: ComponentFixture<KitchenFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KitchenFilterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KitchenFilterComponent); 
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
