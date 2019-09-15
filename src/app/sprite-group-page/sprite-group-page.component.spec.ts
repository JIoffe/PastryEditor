import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpriteGroupPageComponent } from './sprite-group-page.component';

describe('SpriteGroupPageComponent', () => {
  let component: SpriteGroupPageComponent;
  let fixture: ComponentFixture<SpriteGroupPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpriteGroupPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpriteGroupPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
