import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopularItems} from './popular-items';

describe('PopularItems', () => {
  let component: PopularItems;
  let fixture: ComponentFixture<PopularItems>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopularItems]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopularItems);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
