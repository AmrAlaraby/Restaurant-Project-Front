import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowseMenuPage } from './browse-menu-page';

describe('BrowseMenuPage', () => {
  let component: BrowseMenuPage;
  let fixture: ComponentFixture<BrowseMenuPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrowseMenuPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrowseMenuPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
