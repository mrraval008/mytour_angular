import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCubeComponent } from './user-cube.component';

describe('UserCubeComponent', () => {
  let component: UserCubeComponent;
  let fixture: ComponentFixture<UserCubeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserCubeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserCubeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
