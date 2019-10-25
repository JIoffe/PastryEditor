import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpriteCutterLibraryComponent } from './sprite-cutter-library.component';

describe('SpriteCutterLibraryComponent', () => {
  let component: SpriteCutterLibraryComponent;
  let fixture: ComponentFixture<SpriteCutterLibraryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpriteCutterLibraryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpriteCutterLibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
