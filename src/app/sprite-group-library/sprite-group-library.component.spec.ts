import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpriteGroupLibraryComponent } from './sprite-group-library.component';

describe('SpriteGroupLibraryComponent', () => {
  let component: SpriteGroupLibraryComponent;
  let fixture: ComponentFixture<SpriteGroupLibraryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpriteGroupLibraryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpriteGroupLibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
