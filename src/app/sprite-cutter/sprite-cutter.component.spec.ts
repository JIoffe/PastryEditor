import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpriteCutterComponent } from './sprite-cutter.component';

describe('SpriteCutterComponent', () => {
  let component: SpriteCutterComponent;
  let fixture: ComponentFixture<SpriteCutterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpriteCutterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpriteCutterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
