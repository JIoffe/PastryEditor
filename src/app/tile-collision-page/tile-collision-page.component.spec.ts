import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TileCollisionPageComponent } from './tile-collision-page.component';

describe('TileCollisionPageComponent', () => {
  let component: TileCollisionPageComponent;
  let fixture: ComponentFixture<TileCollisionPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TileCollisionPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TileCollisionPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
