import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TraceImageSelectorComponent } from './trace-image-selector.component';

describe('TraceImageSelectorComponent', () => {
  let component: TraceImageSelectorComponent;
  let fixture: ComponentFixture<TraceImageSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TraceImageSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TraceImageSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
