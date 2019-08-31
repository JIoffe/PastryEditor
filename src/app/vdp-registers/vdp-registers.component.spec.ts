import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VdpRegistersComponent } from './vdp-registers.component';

describe('VdpRegistersComponent', () => {
  let component: VdpRegistersComponent;
  let fixture: ComponentFixture<VdpRegistersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VdpRegistersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VdpRegistersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
