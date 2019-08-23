import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TileStampLibraryComponent } from './tile-stamp-library.component';

describe('TileStampLibraryComponent', () => {
  let component: TileStampLibraryComponent;
  let fixture: ComponentFixture<TileStampLibraryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TileStampLibraryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TileStampLibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
