import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemoryMapComponent } from './memory-map.component';

describe('MemoryMapComponent', () => {
  let component: MemoryMapComponent;
  let fixture: ComponentFixture<MemoryMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemoryMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemoryMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
