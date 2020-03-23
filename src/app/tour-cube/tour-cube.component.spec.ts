import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TourCubeComponent } from './tour-cube.component';

describe('TourCubeComponent', () => {
  let component: TourCubeComponent;
  let fixture: ComponentFixture<TourCubeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TourCubeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TourCubeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
