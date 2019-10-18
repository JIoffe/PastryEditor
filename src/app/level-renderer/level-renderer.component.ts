import { Component, OnInit, ViewChild, ElementRef, OnChanges, SimpleChanges, Input } from '@angular/core';
import { BaseSubscriberComponent } from '../base-subscriber.component';
import { Level } from 'src/model/level';
import { ApplicationState } from 'src/services/application-state';

const hflipFlag = 0x0800;
const vflipFlag = 0x1000;

@Component({
  selector: 'app-level-renderer',
  templateUrl: './level-renderer.component.html',
  styleUrls: ['./level-renderer.component.css']
})
export class LevelRendererComponent extends BaseSubscriberComponent implements OnInit, OnChanges {
  @ViewChild('canvas', null) canvas:ElementRef;
  @Input() width: number = 128;
  @Input() height: number = 128;
  @Input() level: Level = null;
  @Input() zoom: number = 100.0;

  @Input() offsetX: number = 0;
  @Input() offsetY: number = 0;

  @Input() isViewport = false;

  constructor(private applicationState: ApplicationState) {
    super();
  }

  ngOnInit() {
    this.render();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.render();
  }

  render(){
    if(!this.level)
      return;

    const canvas  = this.canvas.nativeElement,
          rect    = canvas.getBoundingClientRect(),
          w       = Math.floor(rect.right - rect.left),
          h       = Math.floor(rect.bottom - rect.top);

    canvas.setAttribute('width', w + '');
    canvas.setAttribute('height', h + '');

    const ctx = canvas.getContext('2d');
    const buffer = ctx.createImageData(w, h);
    const data = buffer.data;

    let cellSizeX, cellSizeY;

    if(this.isViewport){
      cellSizeX = w / this.level.width * this.zoom * 0.01;
      cellSizeY = h / this.level.height * this.zoom * 0.01; 
    }else{
      cellSizeY = cellSizeX = this.zoom * 0.08;
    }

    for(let x = w - 1; x >= 0; --x){
      for(let y = h - 1; y >= 0; --y){
        const i = (x + y * w) * 4;

        const factorX = (x + this.offsetX) / cellSizeX,
              factorY = (y + this.offsetY) / cellSizeY;

        if(factorX >= this.level.width || factorY >= this.level.height){
          data[i] = 0;
          data[i + 1] = 0;
          data[i + 2] = 0;
          data[i + 3] = 0;
          continue;
        }

        const tileX = Math.floor(factorX),
              tileY = Math.floor(factorY),
              levelTileI = tileX + tileY * this.level.width;

        const tileIndex = this.level.tiles[levelTileI];
        if(tileIndex === -1){
          data[i] = 0;
          data[i + 1] = 0;
          data[i + 2] = 0;
          data[i + 3] = 0;          
          continue;
        }

        let palette = this.applicationState.palettes[(tileIndex & 0x6000) / 0x2000];

        const tile = this.applicationState.tiles[0x07FF & tileIndex];
        let   indexX = Math.floor((factorX - tileX) * 8),
              indexY = Math.floor((factorY - tileY) * 8);

        if(!!(tileIndex & hflipFlag))
          indexX = 7 - indexX;

        if(!!(tileIndex & vflipFlag))
          indexY = 7 - indexY;

        const index = tile[indexX + indexY * 8],
              color = palette[index];

        data[i] = color.r;
        data[i + 1] = color.g;
        data[i + 2] = color.b;
        data[i + 3] = 255;  
      }
    }

    ctx.putImageData(buffer, 0, 0);
  }
}
