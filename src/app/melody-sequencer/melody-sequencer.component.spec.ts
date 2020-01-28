import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MelodySequencerComponent } from './melody-sequencer.component';

describe('MelodySequencerComponent', () => {
  let component: MelodySequencerComponent;
  let fixture: ComponentFixture<MelodySequencerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MelodySequencerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MelodySequencerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
