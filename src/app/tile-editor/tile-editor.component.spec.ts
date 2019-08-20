import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TileEditorComponent } from './tile-editor.component';

describe('TileEditorComponent', () => {
  let component: TileEditorComponent;
  let fixture: ComponentFixture<TileEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TileEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TileEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
