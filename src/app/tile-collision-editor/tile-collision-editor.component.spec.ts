import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TileCollisionEditorComponent } from './tile-collision-editor.component';

describe('TileCollisionEditorComponent', () => {
  let component: TileCollisionEditorComponent;
  let fixture: ComponentFixture<TileCollisionEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TileCollisionEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TileCollisionEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
