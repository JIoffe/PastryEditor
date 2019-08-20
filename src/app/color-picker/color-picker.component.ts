import { Component, OnInit, Input, ViewChild, ElementRef, EventEmitter, Output } from '@angular/core';
import { Color } from '../../model/color';

@Component({
  selector: 'app-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.css']
})
export class ColorPickerComponent implements OnInit {
  @ViewChild('hueSatPicker', null) hueSatPicker:ElementRef;
  @ViewChild('lightnessPicker', null) lightnessPicker:ElementRef;
  @Input() color: Color;
  @Output() colorSelected = new EventEmitter<Color>();
  
  public hsl: number[];

  constructor() { }

  ngOnInit() {
    this.renderHueSaturation();
    this.onColorUpdated(this.color || new Color(150, 20, 255));
  }

  onColorUpdated(color: Color) {
    this.color = color;
    this.color.clampToSegaMD();
    this.hsl = Color.rgbToHSL(this.color.r, this.color.g, this.color.b);
    this.redrawLightnessBar();
  }

  refreshToColor(color: Color){
    this.color = color;
    this.color.clampToSegaMD();
    this.redrawLightnessBar();
  }

  hueSaturationPicker_onMouse(e: MouseEvent){
    if(e.buttons === 0)
      return;

    const rect = this.hueSatPicker.nativeElement.getBoundingClientRect(),
          w    = rect.right - rect.left,
          h    = rect.bottom - rect.top;

    const hue = (e.pageX - rect.left) / w,
          saturation = (e.pageY - rect.top ) / h;

    this.refreshToColor(Color.fromHSL(hue, saturation, 0.5));

    this.hsl[0] = hue * 360;
    this.hsl[1] = saturation * 100;
    this.hsl[2] = 50;
  }

  lightnessPicker_onMouse(e: MouseEvent){
    if(e.buttons === 0)
      return;

    const rect = this.lightnessPicker.nativeElement.getBoundingClientRect(),
          h    = rect.bottom - rect.top;

    this.hsl[2] = (1.0 - (e.pageY - rect.top ) / h) * 100;
    this.refreshToColor(Color.fromHSL(this.hsl[0] / 360, this.hsl[1] / 100, this.hsl[2] / 100));
  }

  ok_click(e: MouseEvent){
    this.colorSelected.emit(this.color);
  }

  cancel_click(e: MouseEvent){
    this.colorSelected.emit(null);
  }

  private renderHueSaturation(){
    const rect = this.hueSatPicker.nativeElement.getBoundingClientRect(),
          w    = rect.right - rect.left,
          h    = rect.bottom - rect.top;

    this.hueSatPicker.nativeElement.setAttribute('height', h + '');
    this.hueSatPicker.nativeElement.setAttribute('width', w + '');
    const ctx = this.hueSatPicker.nativeElement.getContext('2d');

    for(let x = 0; x < w; ++x){
      for(let y = 0; y < h; ++y){
        let pixel = Color.fromHSL((x / w), (y / h), 0.5);
        pixel.clampToSegaMD();
        ctx.fillStyle = pixel.toCSS();
        ctx.fillRect(x,y,1,1);
      }
    }
  }

  private redrawLightnessBar(){
    const rect = this.lightnessPicker.nativeElement.getBoundingClientRect(),
          w    = rect.right - rect.left,
          h    = rect.bottom - rect.top;

    this.lightnessPicker.nativeElement.setAttribute('height', h + '');
    this.lightnessPicker.nativeElement.setAttribute('width', w + '');
    const ctx = this.lightnessPicker.nativeElement.getContext('2d');  

    ctx.fillStyle = '#DDD';
    ctx.fillRect(0,0,w,h);

    const markerY = (1 - (this.hsl[2] / 100)) * h;
    ctx.beginPath();
    ctx.moveTo(w / 2, markerY);
    ctx.lineTo(w, markerY);
    ctx.stroke();

    for(let y = 0; y < h; ++y){
      let lightness = (1 - y / h);
      let color = Color.fromHSL(this.hsl[0] / 360, this.hsl[1] / 100, lightness);
      color.clampToSegaMD();
      ctx.fillStyle = color.toCSS();
      ctx.fillRect(0, y , w / 2, 1);
    }
  }
}
