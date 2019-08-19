import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaletteLibraryComponent } from './palette-library.component';

describe('PaletteLibraryComponent', () => {
  let component: PaletteLibraryComponent;
  let fixture: ComponentFixture<PaletteLibraryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaletteLibraryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaletteLibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
