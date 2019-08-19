import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Color } from 'src/model/color';

@Component({
  selector: 'app-palette-library',
  templateUrl: './palette-library.component.html',
  styleUrls: ['./palette-library.component.css']
})
export class PaletteLibraryComponent implements OnInit {
  @Input() palettes: Color[][];
  @Input() activePalette: Color[];
  @Output() swatchSelected = new EventEmitter<Color>();
  @Output() paletteSelected = new EventEmitter<Color[]>();
  tooltip = '';

  constructor() { }

  ngOnInit() {
  }

  palettes_onChange(ev: MouseEvent, palette: Color[]){
    this.paletteSelected.emit(palette);
  }

  palettes_onMouseLeave(ev: MouseEvent){
    this.tooltip = '';
  }

  swatch_onHover(ev: MouseEvent, paletteIndex: number, colorIndex: number){
    this.tooltip = `Palette: ${paletteIndex}, Color: ${colorIndex}`;
  }

  swatch_onClick(ev: MouseEvent, color: Color){
    this.swatchSelected.emit(color);
  }
}
