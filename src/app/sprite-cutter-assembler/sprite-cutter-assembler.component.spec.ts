import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpriteCutterAssemblerComponent } from './sprite-cutter-assembler.component';

describe('SpriteCutterAssemblerComponent', () => {
  let component: SpriteCutterAssemblerComponent;
  let fixture: ComponentFixture<SpriteCutterAssemblerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpriteCutterAssemblerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpriteCutterAssemblerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
