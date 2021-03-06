import { Component } from '@angular/core';
import { ApplicationState } from 'src/services/application-state';
import { Stamp } from 'src/model/stamp';
import { BaseSubscriberComponent } from '../base-subscriber.component';
import { TileRenderer } from 'src/services/tile-renderer';

@Component({
  selector: 'app-tile-stamp-library',
  templateUrl: './tile-stamp-library.component.html',
  styleUrls: ['./tile-stamp-library.component.css']
})
export class TileStampLibraryComponent extends BaseSubscriberComponent {
  code: string = null;
  tooltip = '';

  showNewStampDialog = false;

  constructor(private applicationState: ApplicationState, private tileRenderer: TileRenderer) {
    super();
  }

  add_onClick(ev: MouseEvent){
    this.showNewStampDialog = true;
  }

  remove_onClick(ev: MouseEvent){
    if(!this.applicationState.activeStamp)
      return;

    const n = this.applicationState.activeStamp.width * this.applicationState.activeStamp.height;
    let i = this.applicationState.tiles.indexOf(this.applicationState.activeStamp.tiles[0]);

    this.applicationState.tiles.splice(i, n);

    i = this.applicationState.stamps.indexOf(this.applicationState.activeStamp);
    this.applicationState.stamps.splice(i, 1);

    this.applicationState.TilesetObservable.next(this.applicationState.tiles);
    this.applicationState.StampsetUpdatedObservable.next(this.applicationState.stamps);

    if(this.applicationState.stamps.length > 0)
      this.applicationState.activeStamp = this.applicationState.stamps[Math.max(0, i - 1)];
    else
      this.applicationState.activeStamp = null;

    this.applicationState.StampSelectedObservable.next(this.applicationState.activeStamp);
  }

  icon_onClick(ev: MouseEvent, i: number){
    this.applicationState.StampSelectedObservable.next(this.applicationState.stamps[i]);
  }

  library_onMouseLeave(ev: MouseEvent){
    this.tooltip = '';
  }

  icon_onHover(ev: MouseEvent, i: number){
    this.tooltip = `Stamp: ${i}`;
  }

  onSizeSelected(size: number[]){
    if(!!size){
      const w = size[0],
            h = size[1],
            n = w * h;

      const newTiles = new Array(n);
      for(let i = n - 1; i >= 0; --i)
        newTiles[i] = new Uint8Array(64);
  
      this.applicationState.tiles.push(...newTiles);
      this.applicationState.TilesetObservable.next(this.applicationState.tiles);
  
      const stamp = new Stamp();
      stamp.width = w;
      stamp.height = h;
      stamp.tiles = newTiles;
  
      this.applicationState.stamps.push(stamp);
      this.applicationState.StampsetUpdatedObservable.next(this.applicationState.stamps);
      this.applicationState.StampSelectedObservable.next(stamp);
    }

    this.showNewStampDialog = false;
  }

  code_onClick(ev: MouseEvent){
    this.code = `;"Stamps" are rectangular groups of tiles.\r\n;1 byte for width, 1 byte for height, 2 bytes for starting index\r\n`;
    this.code += `;${this.applicationState.stamps.length} stamps(s)\r\Stamps:\r\n`;

    this.applicationState.stamps.forEach((stamp, stampIndex) => {
      let widthByte = stamp.width.toString(16).toUpperCase();
      if(widthByte.length === 1)
        widthByte = '0' + widthByte;

      let heightByte = stamp.height.toString(16).toUpperCase();
      if(heightByte.length === 1){
        heightByte = '0' + heightByte;
      }

      let indexWord = this.applicationState.tiles.indexOf(stamp.tiles[0]).toString(16).toUpperCase();
      while(indexWord.length < 4){
        indexWord = '0' + indexWord;
      }

      let name = stamp.name || `Stamp${stampIndex}`;

      this.code += `${name}:\r\n`
      this.code += `   dc.b $${widthByte}\r\n`;
      this.code += `   dc.b $${heightByte}\r\n`;
      this.code += `   dc.w $${indexWord}\r\n`;
      this.code += '\r\n';
    });
  }

  onCodeChanged(code: string){
    if(!!code){
      let regex = /([0-9a-z]+:)/gmi;
      let dividers = code.match(regex);
      
      let stamps = [];
      dividers.map((s, i) => {
        const loc = code.indexOf(s);
        let end;
        if(i < dividers.length - 1){
          console.log(s, dividers[i+1]);
          end = code.indexOf(dividers[i+1]);
        }
   
        return code.substring(loc, end);
      }).forEach(section => {
        console.log(section);
        let values = section.match(/\$[0-9a-f]{2,4}/gmi);
        console.log(values);
        if(!!values && values.length === 3){
          values = values.map(m => m.substr(1));
          var stamp = new Stamp();
          stamp.width = parseInt(values[0], 16);
          stamp.height = parseInt(values[1], 16);
          stamp.name = section.substr(0, section.indexOf(':')).trim()

          const n = stamp.width * stamp.height;
          const i = parseInt(values[2], 16);
          stamp.tiles = this.applicationState.tiles.slice(i, i + n);
          stamps.push(stamp);
        }
       });

       this.applicationState.stamps = stamps;
       this.applicationState.StampsetUpdatedObservable.next(stamps);
    }
    this.code = null;
  }
}
