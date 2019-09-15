import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LevelEditorComponent } from './level-editor.component';

describe('LevelEditorComponent', () => {
  let component: LevelEditorComponent;
  let fixture: ComponentFixture<LevelEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LevelEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LevelEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
