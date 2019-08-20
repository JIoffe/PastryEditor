import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { Color } from 'src/model/color';
import { ApplicationState } from 'src/services/application-state';

@Component({
  selector: 'app-tile-library',
  templateUrl: './tile-library.component.html',
  styleUrls: ['./tile-library.component.css']
})
export class TileLibraryComponent implements OnInit, OnChanges {
  @Input() palette: Color[];
  @Input() tiles: Uint8Array[];
  @Input() activeTile: Uint8Array;
  @Output() tileSetReplaced = new EventEmitter<Uint8Array[]>();
  @Output() tileSelected = new EventEmitter<Uint8Array>();
  @Output() tileDeleted = new EventEmitter<Uint8Array>();
  
  tileIcons = [];
  lastPalette = null;
  tooltip = '';
  showCodeEditor = false;
  code = '';

  constructor(private applicationState: ApplicationState) {
    applicationState.TileUpdatedObservable.subscribe(tile => {
      let i = this.tiles.indexOf(tile);
      if(i >= 0){
        this.updateIconAtIndex(i);
      }
    })

    applicationState.PaletteObservable.subscribe(palette => {
      this.palette = palette;
      this.updateIcons();
    })
  }

  ngOnInit() {

  }

  ngOnChanges(changes: import("@angular/core").SimpleChanges): void {
    this.updateIcons();
  }

  icon_onClick(ev: MouseEvent, i: number){
    this.tileSelected.emit(this.tiles[i]);
  }

  library_onMouseLeave(ev: MouseEvent){
    this.tooltip = '';
  }

  icon_onHover(ev: MouseEvent, i: number){
    this.tooltip = `Tile: ${i}`;
  }

  add_onClick(ev: MouseEvent){
    this.tiles.push(new Uint8Array(64));
    this.tileSelected.emit(this.tiles[this.tiles.length - 1]);
  }

  remove_onClick(ev: MouseEvent){
    if(this.tiles.length === 1){
      alert("Must have at least one tile!");
      return;
    }

    this.tileDeleted.emit(this.activeTile);
  }

  code_onClick(ev: MouseEvent){
    this.code = 'Tiles:\r\n';

    this.tiles.forEach((tile, tileIndex) => {
      this.code += `Tile${tileIndex}:\r\n`;

      for(let i = 0; i < 64; i += 8){
        const line = Array.from(tile.slice(i, i+8)).map(n => n.toString(16).toUpperCase()).reduce((p,c) => p + c, '');
        this.code += `   dc.l $${line}`;
        this.code += '\r\n';
      }
    });

    this.showCodeEditor = true;
  }

  onCodeChanged(code: string){
    if(code !== null){
      const matches = code.match(/\$[0-9A-Ea-e]{8}/g);
      let tileset: Uint8Array[];

      if(matches === null){
        tileset = [new Uint8Array(64)];
      }else{
        const indices = Array.from(matches.reduce((p,c) => p + c.substr(1),''));

        if(indices.length % 64 !== 0){
          const r = 64 - (indices.length % 64);
          for(let i = 0; i < r; ++i){
            indices.push('0');
          }
        }

        tileset = new Array(indices.length / 64);
        for(let i = 0; i < tileset.length; ++i){
          tileset[i] = new Uint8Array(64);
        }

        indices.forEach((index, i) => {
            const tileIndex = Math.floor(i/64);
            const colorIndex = i % 64;

            tileset[tileIndex][colorIndex] = parseInt(index, 16);
          });
      }

      this.tileSetReplaced.emit(tileset);
    }
    this.showCodeEditor = false;
  }

  private updateIcons(){
    //Only re-render everything if we are grossly out of date
    //Otherwise we will see lag while drawing
    if(this.lastPalette !== this.palette || this.tileIcons.length !== this.tiles.length){
      this.tileIcons = new Array(this.tiles.length);

      for(let i = 0; i < this.tiles.length; ++i){
        this.updateIconAtIndex(i);
      }
      this.lastPalette = this.palette;
    }else{
      this.updateIconAtIndex(this.tiles.indexOf(this.activeTile));
    }
  }

  private updateIconAtIndex(index){
    const canvas = document.createElement('canvas');    
    canvas.setAttribute('width', '8');
    canvas.setAttribute('height', '8');

    const ctx =  canvas.getContext('2d');
    const imageData = ctx.createImageData(8, 8);

    const tile = this.tiles[index];

    for(let x = 0; x < 8; ++x){
      for(let y = 0; y < 8; ++y){
        const i = x + y * 8,
              colorIndex = tile[i],
              pixelI = i * 4;

        //Ignore Transparent index
        if(colorIndex === 0){
            imageData.data[pixelI] = 0;
            imageData.data[pixelI + 1] = 0;
            imageData.data[pixelI + 2] = 0;
            imageData.data[pixelI + 3] = 0;
            continue;
        }

        const color = this.palette[colorIndex];
        imageData.data[pixelI] = color.r;
        imageData.data[pixelI + 1] = color.g;
        imageData.data[pixelI + 2] = color.b;
        imageData.data[pixelI + 3] = 255;
      }
    }

    ctx.putImageData(imageData, 0, 0);
    this.tileIcons[index] = canvas.toDataURL("image/png");
  }
}
