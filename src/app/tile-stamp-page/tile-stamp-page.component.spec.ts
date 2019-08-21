import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TileStampPageComponent } from './tile-stamp-page.component';

describe('TileStampPageComponent', () => {
  let component: TileStampPageComponent;
  let fixture: ComponentFixture<TileStampPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TileStampPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TileStampPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
