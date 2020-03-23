import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserProfileDialogWrapperComponent } from './user-profile-dialog-wrapper.component';

describe('UserProfileDialogWrapperComponent', () => {
  let component: UserProfileDialogWrapperComponent;
  let fixture: ComponentFixture<UserProfileDialogWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserProfileDialogWrapperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserProfileDialogWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
