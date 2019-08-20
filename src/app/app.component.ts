import { Component, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { Color } from 'src/model/color';
import { ApplicationState } from 'src/services/application-state';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private applicationState: ApplicationState){}

  showColorPicker = false;

  //State that matters throughout the entire app
  activeSwatch = null;
  palettes = [
    [0x0000, 0x0000, 0x0EEE, 0x0E00, 0x00E0, 0x000E, 0x00EE, 0x0E0E, 0x0EE0, 0x0222, 0x0444, 0x0666, 0x0888, 0x0AAA, 0x0CCC, 0x0EEE].map(Color.fromSegaMDWord),
    [0x0000, 0x0000, 0x0EEE, 0x0E00, 0x00E0, 0x000E, 0x00EE, 0x0E0E, 0x0EE0, 0x0222, 0x0444, 0x0666, 0x0888, 0x0AAA, 0x0CCC, 0x0EEE].map(Color.fromSegaMDWord),
    [0x0000, 0x0000, 0x0EEE, 0x0E00, 0x00E0, 0x000E, 0x00EE, 0x0E0E, 0x0EE0, 0x0222, 0x0444, 0x0666, 0x0888, 0x0AAA, 0x0CCC, 0x0EEE].map(Color.fromSegaMDWord),
    [0x0000, 0x0000, 0x0EEE, 0x0E00, 0x00E0, 0x000E, 0x00EE, 0x0E0E, 0x0EE0, 0x0222, 0x0444, 0x0666, 0x0888, 0x0AAA, 0x0CCC, 0x0EEE].map(Color.fromSegaMDWord)
  ];
  activePalette = this.palettes[0];

  tiles = [
    new Uint8Array(64)
  ];
  activeTile = this.tiles[0];

  title = 'Pastry';


  onColorSelected(color: Color) {
    this.showColorPicker = false;
    if(color !== null){
      this.activeSwatch.r = color.r;
      this.activeSwatch.g = color.g;
      this.activeSwatch.b = color.b;
    }

    this.applicationState.PaletteObservable.next(this.activePalette);
  }

  /* TILE LIBRARY EVENTS */
  onTileSelected(tile: Uint8Array){
    this.activeTile = tile;
  }

  onTileDeleted(tile: Uint8Array){
    const i = this.tiles.indexOf(tile);
    if(i >= 0){
      this.tiles.splice(i, 1);
      this.activeTile = this.tiles[0];
    }
  }

  onActiveTileUpdated(tile: Uint8Array){
    this.activeTile.set(tile);
  }

  onPaletteSelected(palette: Color[]){
    this.activePalette = palette;
  }

  onSwatchSelected(color: Color){
    this.activeSwatch = color;
    this.showColorPicker = true;
  }

  onPalettesUpdated(palettes: Color[][]){
    if(palettes !== null){
      this.palettes = palettes;
      this.activePalette = this.palettes[0];
    }
  }
}
