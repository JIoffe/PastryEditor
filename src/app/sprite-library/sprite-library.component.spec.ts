import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpriteLibraryComponent } from './sprite-library.component';

describe('SpriteLibraryComponent', () => {
  let component: SpriteLibraryComponent;
  let fixture: ComponentFixture<SpriteLibraryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpriteLibraryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpriteLibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
