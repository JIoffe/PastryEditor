import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TileLibraryComponent } from './tile-library.component';

describe('TileLibraryComponent', () => {
  let component: TileLibraryComponent;
  let fixture: ComponentFixture<TileLibraryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TileLibraryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TileLibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
