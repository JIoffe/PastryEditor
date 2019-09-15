import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LevelEditModeComponent } from './level-edit-mode.component';

describe('LevelEditModeComponent', () => {
  let component: LevelEditModeComponent;
  let fixture: ComponentFixture<LevelEditModeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LevelEditModeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LevelEditModeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
