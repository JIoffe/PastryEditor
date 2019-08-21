import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Color } from 'src/model/color';
import { ApplicationState } from 'src/services/application-state';

@Component({
  selector: 'app-palette-library',
  templateUrl: './palette-library.component.html',
  styleUrls: ['./palette-library.component.css']
})
export class PaletteLibraryComponent implements OnInit {
  @Input() palettes: Color[][];
  @Input() activePalette: Color[];

  tooltip = '';
  code = null;
  activeSwatch = null;

  constructor(private applicationState: ApplicationState) {
    applicationState.PaletteSetObservable.subscribe(palettes => {
      this.palettes = palettes;
      this.activePalette = palettes[0];
      applicationState.PaletteObservable.next(this.activePalette);
    })
  }

  ngOnInit() {
    this.palettes = this.applicationState.palettes;
    this.activePalette = this.applicationState.activePalette;
  }

  palettes_onChange(ev: MouseEvent, palette: Color[]){
    this.activePalette = palette;
    this.applicationState.PaletteObservable.next(palette);
  }

  palettes_onMouseLeave(ev: MouseEvent){
    this.tooltip = '';
  }

  swatch_onHover(ev: MouseEvent, paletteIndex: number, colorIndex: number){
    this.tooltip = `Palette: ${paletteIndex}, Color: ${colorIndex}`;
  }

  /* COLOR EDITING */
  swatch_onClick(ev: MouseEvent, color: Color){
    this.activeSwatch = color;
  }

  onColorSelected(color: Color){
    if(color !== null){
      this.activeSwatch.r = color.r;
      this.activeSwatch.g = color.g;
      this.activeSwatch.b = color.b;
      this.applicationState.PaletteObservable.next(this.activePalette);
    }
    this.activeSwatch = null;
  }

  /* CODE EDITING */
  code_onClick(ev: MouseEvent){
    let code = 'Palettes:\r\n';
    this.palettes.forEach((palette, i) => {
      code += `Palette${i}:\r\n`;
      palette.forEach(color => {
        code += `   dc.w ${color.toSegaMDString()}\r\n`;
      });
    });

    this.code = code;
  }

  onCodeChanged(code: string){
    if(code !== null){
      const colorMatches = code.match(/\$[0-9a-fA-F]{4}/g) || [];
      const nPalettes = Math.max(4, Math.ceil(colorMatches.length / 16));
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

      this.applicationState.PaletteSetObservable.next(palettes);
      this.applicationState.PaletteObservable.next(palettes[0]);
    }

    this.code = null;
  }
}
