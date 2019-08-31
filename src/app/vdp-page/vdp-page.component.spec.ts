import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VdpPageComponent } from './vdp-page.component';

describe('VdpPageComponent', () => {
  let component: VdpPageComponent;
  let fixture: ComponentFixture<VdpPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VdpPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VdpPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
