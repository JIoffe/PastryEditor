import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TileHeightmapRendererComponent } from './tile-heightmap-renderer.component';

describe('TileHeightmapRendererComponent', () => {
  let component: TileHeightmapRendererComponent;
  let fixture: ComponentFixture<TileHeightmapRendererComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TileHeightmapRendererComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TileHeightmapRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
