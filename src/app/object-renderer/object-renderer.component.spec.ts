import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectRendererComponent } from './object-renderer.component';

describe('ObjectRendererComponent', () => {
  let component: ObjectRendererComponent;
  let fixture: ComponentFixture<ObjectRendererComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObjectRendererComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObjectRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
