import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MazeNavigatorComponent } from './maze-navigator.component';

describe('MazeNavigatorComponent', () => {
  let component: MazeNavigatorComponent;
  let fixture: ComponentFixture<MazeNavigatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MazeNavigatorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MazeNavigatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
