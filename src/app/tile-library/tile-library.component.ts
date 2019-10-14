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
  tooltip = '';

  code = null;

  constructor(private applicationState: ApplicationState, private tileRenderer: TileRenderer) {
    super();
  }

  ngOnInit() {
  }

  library_onMouseLeave(ev: MouseEvent){
    this.tooltip = '';
  }

  icon_onHover(ev: MouseEvent, i: number){
    this.tooltip = `Tile: ${i}`;
  }

  icon_onClick(ev: MouseEvent, i: number){
    this.applicationState.TileSelectedObservable.next(this.applicationState.tiles[i]);
  }

  add_onClick(ev: MouseEvent){
    const tile = new Uint8Array(64);
    this.applicationState.tiles.push(tile);
    this.applicationState.TilesetObservable.next(this.applicationState.tiles);
    this.applicationState.TileSelectedObservable.next(tile);
    console.log('tile');
  }

  remove_onClick(ev: MouseEvent){
    const i = this.applicationState.tiles.indexOf(this.applicationState.activeTile);
    this.applicationState.tiles.splice(i, 1);
    this.applicationState.TilesetObservable.next(this.applicationState.tiles);

    this.applicationState.TileSelectedObservable.next(this.applicationState.tiles[Math.max(i - 1, 0)]);
  }

  code_onClick(ev: MouseEvent){
    this.code = `;${this.applicationState.tiles.length} tile(s)\r\nTiles:\r\n`;

    this.applicationState.tiles.forEach((tile, tileIndex) => {
      for(let i = 0; i < 64; i += 8){
        const line = Array.from(tile.slice(i, i+8)).map(n => n.toString(16).toUpperCase()).reduce((p,c) => p + c, '');
        this.code += `   dc.l $${line}`;
        this.code += '\r\n';
      }
    });
  }

  onCodeChanged(code: string){
    if(code !== null){
      const matches = code.match(/\$[0-9A-Ea-f]{8}/gmi);
      let tileset: Uint8Array[];

      if(matches === null){
        tileset = [];
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
}
