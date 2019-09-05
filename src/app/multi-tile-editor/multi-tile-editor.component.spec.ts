import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiTileEditorComponent } from './multi-tile-editor.component';

describe('MultiTileEditorComponent', () => {
  let component: MultiTileEditorComponent;
  let fixture: ComponentFixture<MultiTileEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultiTileEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiTileEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
