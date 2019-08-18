import { Component, OnInit, Input, OnChanges, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { Color } from '../../model/color';

@Component({
  selector: 'app-color-slider',
  templateUrl: './color-slider.component.html',
  styleUrls: ['./color-slider.component.css']
})
export class ColorSliderComponent implements OnInit, OnChanges {
  @ViewChild('trackbar', null) trackbar:ElementRef;
  @Output() colorUpdated = new EventEmitter<Color>();
  @Input() color: Color;
  /**
   * Channel mask for this slider
   */
  @Input() mask: number;

  public fillColor: Color;
  public previewColors: Color[];
  public title: string;
  public intensity: number;
  public channelValue: number;

  constructor() {}

  ngOnInit() {
    this.mask = this.mask || 0xFF0000;
    this.fillColor = Color.fromHexRGB(this.mask);

    if(this.mask & 0xFF0000){
      this.title = 'Red';
    }else if(this.mask & 0x00FF00){
      this.title = 'Green';
    }else{
      this.title = 'Blue';
    }
  }

  ngOnChanges(changes: import("@angular/core").SimpleChanges): void {
    this.updatePreviewColors();

    let shift = 0;
    if(this.mask & 0xFF0000){
      shift = 16;
      this.channelValue = this.color.r;
    }else if(this.mask & 0x00FF00){
      shift = 8;
      this.channelValue = this.color.g;
    }else{
      this.channelValue = this.color.b;
    }

    //Clamp intensity of slider to 8 possible values
    this.intensity = ((this.mask & this.color.to24Bit()) >> shift) / 255;
    const step = 1 / 7;
    const r = this.intensity % step;
    if(r > step / 2){
      this.intensity = Math.min(1.0, this.intensity + step - r);
    }else{
      this.intensity = Math.max(0.0, this.intensity - r);
    }
  }

  trackbar_onMouse(e: MouseEvent){
    if(e.buttons === 0)
      return;

    const rect = this.trackbar.nativeElement.getBoundingClientRect();
    const intensity = (e.pageX - rect.left) / (rect.right - rect.left);

    if(this.mask & 0xFF0000){
      this.color.r = intensity * 255;
    }else if(this.mask & 0x00FF00){
      this.color.g = intensity * 255;
    }else{
      this.color.b = intensity * 255;
    }

    this.colorUpdated.emit(Color.fromColor(this.color));
  }

  private updatePreviewColors(){
    this.previewColors = Color.getSegaMDRamp();
    this.previewColors.forEach(c => {
      if(this.mask & 0xFF0000){
        c.g = this.color.g;
        c.b = this.color.b;
      }else if(this.mask & 0x00FF00){
        c.r = this.color.r;
        c.b = this.color.b;
      }else{
        c.g = this.color.g;
        c.r = this.color.r;
      }
    });
  }
}
