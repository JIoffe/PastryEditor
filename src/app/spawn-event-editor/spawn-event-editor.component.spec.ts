import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpawnEventEditorComponent } from './spawn-event-editor.component';

describe('SpawnEventEditorComponent', () => {
  let component: SpawnEventEditorComponent;
  let fixture: ComponentFixture<SpawnEventEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpawnEventEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpawnEventEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
