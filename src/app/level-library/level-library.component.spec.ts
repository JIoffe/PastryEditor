import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LevelLibraryComponent } from './level-library.component';

describe('LevelLibraryComponent', () => {
  let component: LevelLibraryComponent;
  let fixture: ComponentFixture<LevelLibraryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LevelLibraryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LevelLibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
