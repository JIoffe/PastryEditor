import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StampEditorComponent } from './stamp-editor.component';

describe('StampEditorComponent', () => {
  let component: StampEditorComponent;
  let fixture: ComponentFixture<StampEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StampEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StampEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
