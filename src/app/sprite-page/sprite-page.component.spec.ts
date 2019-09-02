import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpritePageComponent } from './sprite-page.component';

describe('SpritePageComponent', () => {
  let component: SpritePageComponent;
  let fixture: ComponentFixture<SpritePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpritePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpritePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
