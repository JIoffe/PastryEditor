import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectColorConverterComponent } from './direct-color-converter.component';

describe('DirectColorConverterComponent', () => {
  let component: DirectColorConverterComponent;
  let fixture: ComponentFixture<DirectColorConverterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DirectColorConverterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DirectColorConverterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
