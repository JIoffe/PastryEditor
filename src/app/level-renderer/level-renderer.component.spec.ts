import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LevelRendererComponent } from './level-renderer.component';

describe('LevelRendererComponent', () => {
  let component: LevelRendererComponent;
  let fixture: ComponentFixture<LevelRendererComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LevelRendererComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LevelRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
