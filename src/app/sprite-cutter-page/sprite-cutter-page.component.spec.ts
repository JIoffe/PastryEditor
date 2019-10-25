import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpriteCutterPageComponent } from './sprite-cutter-page.component';

describe('SpriteCutterPageComponent', () => {
  let component: SpriteCutterPageComponent;
  let fixture: ComponentFixture<SpriteCutterPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpriteCutterPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpriteCutterPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
