import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawToolSelectorComponent } from './draw-tool-selector.component';

describe('DrawToolSelectorComponent', () => {
  let component: DrawToolSelectorComponent;
  let fixture: ComponentFixture<DrawToolSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrawToolSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrawToolSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
