import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ApplicationState } from 'src/services/application-state';
import { BaseSubscriberComponent } from '../base-subscriber.component';
import { TileUtils } from 'src/utils/tile-utils';
import { Level } from 'src/model/level';

//Constants for bit flags on tiles
const paletteFlags = [
  0x0000,
  0x2000,
  0x4000,
  0x6000
];

const hflipFlag = 0x0800;
const vflipFlag = 0x1000;

@Component({
  selector: 'app-level-editor',
  templateUrl: './level-editor.component.html',
  styleUrls: ['./level-editor.component.css']
})
export class LevelEditorComponent extends BaseSubscriberComponent implements OnInit {
  @ViewChild('canvas', null) canvas:ElementRef;
  @ViewChild('editViewport', null) editViewport:ElementRef;
  
  zoom = 100.0;
  showGrid = true;

  cursorX = 0;
  cursorY = 0;
  cursorDisplayX = 0;
  cursorDisplayY = 0;
  cursorFlipX = false;
  cursorFlipY = false;

  lastCursorDrawX = -1;
  lastCursorDrawY = -1;

  code: string = null;
  showImageSelection = false;
  
  constructor(private applicationState: ApplicationState) { 
    super();
  }

  ngOnInit() {
    this.render();

    this.subscribe(
      this.applicationState.LevelSelectedObservable.subscribe(level => {
        this.render();
      })
    );
  }

  onZoomChange(ev: any){
    // @ts-ignore
    this.zoom = ev.target.value;
    this.render();
  }

  onCanvasMouseMove(ev: MouseEvent){
    const level = this.applicationState.activeLevel;
    const canvas  = this.canvas.nativeElement,
          rect    = canvas.getBoundingClientRect();

    const pixelSize = this.zoom * 0.08;
    const cellSize = pixelSize;
    const x = ev.pageX - rect.left,
          y = ev.pageY - rect.top;

    const scrollLeft = this.editViewport.nativeElement.scrollLeft,
          scrollTop = this.editViewport.nativeElement.scrollTop;

    const factorX = (x + scrollLeft) / cellSize,
          factorY = (y + scrollTop) / cellSize;

    if(factorX >= level.width || factorY >= level.height){
      this.cursorX = -1;
      this.cursorY = -1;
      return;
    }

    this.cursorX = Math.floor(factorX);
    this.cursorY = Math.floor(factorY);

    this.cursorDisplayX = this.cursorX*pixelSize - scrollLeft;
    this.cursorDisplayY = this.cursorY*pixelSize - scrollTop;

    if(ev.buttons === 0)
      return;

    if(this.cursorX === this.lastCursorDrawX && this.cursorY === this.lastCursorDrawY)
      return;

    this.lastCursorDrawX = this.cursorX;
    this.lastCursorDrawY = this.cursorY;

    let paletteMask: number = 0;
    switch(this.applicationState.palettes.indexOf(this.applicationState.activePalette)){
        case 0:
          paletteMask = 0;
          break;
        case 1:
          paletteMask = 0x2000;
          break;
        case 2:
          paletteMask = 0x4000;
          break;
        case 3:
          paletteMask = 0x6000;
          break;
    }

    let flipMask = 0;
    if(!!this.cursorFlipX)
      flipMask |= hflipFlag;
    if(!!this.cursorFlipY)
      flipMask |= vflipFlag;

    const i = this.cursorX + this.cursorY * level.width;
    switch(this.applicationState.levelEditMode){
      case 'stamps':{
          const stamp = this.applicationState.activeStamp;
          if(!!stamp){
            for(let x1 = stamp.width - 1; x1 >= 0; --x1){
              for(let y1 = stamp.height - 1; y1 >= 0; --y1){
                let paintX = this.cursorX + x1,
                    paintY = this.cursorY + y1;

                if(paintX >= level.width || paintY >= level.height){
                  continue;
                }

                const xLookup = this.cursorFlipX ? stamp.width - 1 - x1 : x1;
                const yLookup = this.cursorFlipY ? stamp.height - 1 - y1 : y1;

                const paintI = paintX + paintY * level.width;
                const tile = stamp.tiles[xLookup + yLookup * stamp.width];
                const tileIndex = this.applicationState.tiles.indexOf(tile);

                level.tiles[paintI] = tileIndex|paletteMask|flipMask;
              }
            }
          }
        }
        break;
      case 'eraser':
        level.tiles[i] = -1;
        break;
      case 'tiles':
      default:
        if(!!this.applicationState.activeTile){
          let newTile = this.applicationState.tiles.indexOf(this.applicationState.activeTile)|paletteMask|flipMask;

          switch(this.applicationState.drawMode){
            case 'b':
              const tileToChange = level.tiles[i];
              if(newTile !== tileToChange){
                const stack = [[this.cursorX, this.cursorY]];
                while(!!stack.length){
                  const coord = stack.pop();
                  if(coord[0] < 0 || coord[0] >= level.width || coord[1] < 0 || coord[1] >= level.height){
                    continue;
                  }

                  const i1 = coord[0] + coord[1] * level.width;
                  if(level.tiles[i1] !== tileToChange)
                    continue;

                  level.tiles[i1] = newTile;
                  stack.push(
                    [coord[0], coord[1]+1],
                    [coord[0], coord[1]-1],
                    [coord[0]+1, coord[1]],
                    [coord[0]-1, coord[1]]);
                }
              }
              break;
            default:
                level.tiles[i] = newTile;
              break;
          }         
        }
        break;
    }

    this.render();
  }

  onCanvasMouseLeave(ev: MouseEvent){
    this.cursorX = -1;
    this.cursorY = -1;
  }

  render(){
    const level = this.applicationState.activeLevel;

    const scrollLeft = this.editViewport.nativeElement.scrollLeft,
          scrollTop = this.editViewport.nativeElement.scrollTop;

    const cellSize = this.zoom * 0.08;

    const canvas  = this.canvas.nativeElement,
          rect    = canvas.getBoundingClientRect(),
          w       = Math.floor(rect.right - rect.left),
          h       = Math.floor(rect.bottom - rect.top);

    canvas.setAttribute('width', w + '');
    canvas.setAttribute('height', h + '');

    const ctx = canvas.getContext('2d');
    const buffer = ctx.createImageData(w, h);
    const data = buffer.data;

    for(let x = w - 1; x >= 0; --x){
      for(let y = h - 1; y >= 0; --y){
        const i = (x + y * w) * 4;

        const factorX = (x + scrollLeft) / cellSize,
              factorY = (y + scrollTop) / cellSize;
        
        if(factorX >= level.width || factorY >= level.height){
          data[i] = 0;
          data[i + 1] = 0;
          data[i + 2] = 0;
          data[i + 3] = 0;
          continue;
        }

        const tileX = Math.floor(factorX),
              tileY = Math.floor(factorY),
              levelTileI = tileX + tileY * level.width;

        const tileIndex = level.tiles[levelTileI];
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

    if(this.showGrid){
      ctx.strokeStyle = '#FFF';
      let gridStart = cellSize - scrollLeft % cellSize,
          gridEndX = Math.min(rect.right, level.width * cellSize),
          gridEndY = Math.min(rect.bottom, level.height * cellSize);

      for(let x = gridStart; x <= gridEndX; x += cellSize){
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, gridEndY);
        ctx.stroke();
      }

      gridStart = cellSize - scrollTop % cellSize;

      for(let x = gridStart; x <= gridEndY; x += cellSize){
        ctx.beginPath();
        ctx.moveTo(0, x);
        ctx.lineTo(gridEndX, x);
        ctx.stroke();
      }
    }

  }

  code_onClick(ev: MouseEvent){
    if(!this.applicationState.activeLevel)
      return;

    this.code = this.applicationState.activeLevel.toCode();
  }

  onCodeChanged(code: string){
    if(!!this.code){
      const level = Level.fromCode(code);
      if(!!level){
        this.applicationState.activeLevel.copy(level);
        this.render();
      }
    }

    this.code = null;
  }

  //Img proessing

  importImageClick(ev: MouseEvent){
    this.showImageSelection = true;
  }

  onImageProcessed(imageIndices: Uint8Array){
    if(!!imageIndices){
      const level = this.applicationState.activeLevel;
      const paletteMask = this.applicationState.palettes.indexOf(this.applicationState.activePalette) * 0x2000;

      const texelWidth = level.width * 8,
            texelHeight = level.height * 8;

      for(let x = 0; x < texelWidth; x += 8){
        for(let y = 0; y < texelHeight; y += 8){

          //Get indices at current tile
          const tileCursor = new Uint8Array(64);
          for(let x1 = 0; x1 < 8; ++x1){
            for(let y1 = 0; y1 < 8; ++y1){
              let index = (x + x1) + (y + y1) * texelWidth;
              tileCursor[x1 + y1 * 8] = imageIndices[index];
            }
          }

          //Compare to existing tiles
          let tileIndex = this.applicationState.tiles.findIndex(t => TileUtils.tileCmp(tileCursor, t));
          if(tileIndex < 0){
            tileIndex = this.applicationState.tiles.length;
            this.applicationState.tiles.push(tileCursor);
          }

          const levelX = x / 8,
                levelY = y / 8;

          let tileValue = tileIndex | paletteMask;
          this.applicationState.activeLevel.tiles[levelX + levelY * this.applicationState.activeLevel.width] = tileValue;
        }
      }

      this.applicationState.TilesetObservable.next(this.applicationState.tiles);
      this.render();
    }
    this.showImageSelection = false;
  }
}
