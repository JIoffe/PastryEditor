import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawColorSelectorComponent } from './draw-color-selector.component';

describe('DrawColorSelectorComponent', () => {
  let component: DrawColorSelectorComponent;
  let fixture: ComponentFixture<DrawColorSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrawColorSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrawColorSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
