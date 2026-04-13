import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersHeader } from './users-header';

describe('UsersHeader', () => {
  let component: UsersHeader;
  let fixture: ComponentFixture<UsersHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsersHeader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsersHeader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
