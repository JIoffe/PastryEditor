import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LevelPageComponent } from './level-page.component';

describe('LevelPageComponent', () => {
  let component: LevelPageComponent;
  let fixture: ComponentFixture<LevelPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LevelPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LevelPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
