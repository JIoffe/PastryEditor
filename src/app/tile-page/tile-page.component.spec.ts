import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TilePageComponent } from './tile-page.component';

describe('TilePageComponent', () => {
  let component: TilePageComponent;
  let fixture: ComponentFixture<TilePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TilePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TilePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
