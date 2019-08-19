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
  @Output() palettesUpdated = new EventEmitter<Color[][]>();

  tooltip = '';
  code = '';
  showCodeEditor = false;

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

  code_onClick(ev: MouseEvent){
    let code = 'Palettes:\r\n';
    this.palettes.forEach((palette, i) => {
      code += `Palette${i}:\r\n`;
      palette.forEach(color => {
        code += `   dc.w ${color.toSegaMDString()}\r\n`;
      });
    });

    this.code = code;
    this.showCodeEditor = true;
  }

  onCodeChanged(code: string){
    this.showCodeEditor = false;
    if(code !== null){
      const colorMatches = code.match(/\$[0-9a-fA-F]{4}/g);
      const nPalettes = Math.ceil(colorMatches.length / 16);
      const palettes = new Array(nPalettes);
      for(let i = 0; i < nPalettes; ++i){
        palettes[i] = new Array(16);
      }

      colorMatches
        .forEach((color, i) => {
          const value = +('0x' + color.substr(1));
          const paletteIndex = Math.floor(i / 16);
          const colorIndex = i % 16;

          palettes[paletteIndex][colorIndex] = Color.fromSegaMDWord(value);
        });

      //Fill with blanks so there are always multiples of 16 colors
      for(let i = 0; i < palettes.length; ++i){
        for(let j = 0; j < 16; ++j){
          if(!palettes[i][j])
            palettes[i][j] = new Color(0,0,0);
        }
      }

      console.log(palettes);
      this.palettesUpdated.emit(palettes);
    }
  }
}
