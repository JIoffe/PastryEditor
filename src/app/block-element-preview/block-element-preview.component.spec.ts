import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockElementPreviewComponent } from './block-element-preview.component';

describe('BlockElementPreviewComponent', () => {
  let component: BlockElementPreviewComponent;
  let fixture: ComponentFixture<BlockElementPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlockElementPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlockElementPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
