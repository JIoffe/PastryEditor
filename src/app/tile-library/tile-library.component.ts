import { Component, OnInit, Input } from '@angular/core';
import { Color } from 'src/model/color';
import { ApplicationState } from 'src/services/application-state';
import { BaseSubscriberComponent } from '../base-subscriber.component';
import { TileRenderer } from 'src/services/tile-renderer';

@Component({
  selector: 'app-tile-library',
  templateUrl: './tile-library.component.html',
  styleUrls: ['./tile-library.component.css']
})
export class TileLibraryComponent extends BaseSubscriberComponent implements OnInit {
  @Input() palette: Color[];
  @Input() tiles: Uint8Array[];
  @Input() activeTile: Uint8Array;
  
  tileIcons = [];
  tooltip = '';

  code = null;

  constructor(private applicationState: ApplicationState, private tileRenderer: TileRenderer) {
    super();
  }

  ngOnInit() {
    this.subscribe(
      this.applicationState.TileUpdatedObservable.subscribe(tile => {
      }),
  
    //   // this.applicationState.TileSelectedObservable.subscribe(tile => {
    //   //   this.activeTile = tile;
    //   // }),
  
    //   // this.applicationState.PaletteObservable.subscribe(palette => {
    //   //   this.palette = palette;
    //   //   this.updateIcons();
    //   // }),
  
    //   // this.applicationState.TilesetObservable.subscribe(tiles => {
    //   //   this.tiles = tiles;
    //   //   this.updateIcons();
    //   // })
    );

    this.tiles = this.applicationState.tiles;
    this.activeTile = this.applicationState.activeTile;
    this.palette = this.applicationState.activePalette;;
    this.updateIcons();
  }

  library_onMouseLeave(ev: MouseEvent){
    this.tooltip = '';
  }

  icon_onHover(ev: MouseEvent, i: number){
    this.tooltip = `Tile: ${i}`;
  }

  icon_onClick(ev: MouseEvent, i: number){
    this.applicationState.TileSelectedObservable.next(this.tiles[i]);
  }

  add_onClick(ev: MouseEvent){
    const tile = new Uint8Array(64);
    this.tiles.push(tile);
    this.applicationState.TilesetObservable.next(this.tiles);
    this.applicationState.TileSelectedObservable.next(this.tiles[this.tiles.length - 1]);
  }

  remove_onClick(ev: MouseEvent){
    if(this.tiles.length === 1){
      alert("Must have at least one tile!");
      return;
    }

    const i = this.tiles.indexOf(this.activeTile);
    this.tiles.splice(i, 1);
    this.applicationState.TilesetObservable.next(this.tiles);

    this.applicationState.TileSelectedObservable.next(this.tiles[Math.max(i - 1, 0)]);
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

      this.applicationState.TilesetObservable.next(tileset);
      this.applicationState.TileSelectedObservable.next(tileset[0]);
    }

    this.code = null;
  }

  private updateIcons(){
    //Only re-render everything if we are grossly out of date
    //Otherwise we will see lag while drawing
    this.tileIcons = new Array(this.tiles.length);

    for(let i = 0; i < this.tiles.length; ++i){
      this.updateIconAtIndex(i);
    }
  }

  private updateIconAtIndex(index){
    const tile = this.tiles[index];
    this.tileIcons[index] = this.tileRenderer.renderTileDataUrl(tile, this.palette);
  }
}
