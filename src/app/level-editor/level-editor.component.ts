import { Component, OnInit, ViewChild, ElementRef, ɵSWITCH_VIEW_CONTAINER_REF_FACTORY__POST_R3__ } from '@angular/core';
import { ApplicationState } from 'src/services/application-state';
import { BaseSubscriberComponent } from '../base-subscriber.component';
import { TileUtils } from 'src/utils/tile-utils';
import { Level } from 'src/model/level';
import { PalettizedImage } from 'src/model/palettized-image';

//Constants for bit flags on tiles
const paletteFlags = [
  0x0000,
  0x2000,
  0x4000,
  0x6000
];

const hflipFlag = 0x0800;
const vflipFlag = 0x1000;

interface TileDelegate {
  (level: Level, x:number,y:number): void;
}

interface SeekCoordsDelegate{
  (coords: number[]): number[][];
}

interface ValidateCoordsDelegate{
  (x: number, y: number): boolean;
}
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

  ignoreBlanks = false;

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

  onCanvasMouseUp(ev: MouseEvent){
    this.lastCursorDrawX = -1;
    this.lastCursorDrawY = -1;
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

    const paletteMask = this.getPaletteMask(),
          flipMask = this.getFlipMask();

    const i = this.cursorX + this.cursorY * level.width;
    switch(this.applicationState.levelEditMode){
      case 'stamps':{
        if(!this.applicationState.activeStamp)
          return;

          const stamp = this.applicationState.activeStamp,
                w     = stamp.width,
                h     = stamp.height;
          
          const drawFunc = (level: Level, startX: number, startY: number, isValid?: ValidateCoordsDelegate) => {
            for(let x1 = w - 1; x1 >= 0; --x1){
              for(let y1 = h - 1; y1 >= 0; --y1){
                let paintX = startX + x1,
                    paintY = startY + y1;

                if(paintX < 0 || paintY < 0 || paintX >= level.width || paintY >= level.height){
                  continue;
                }

                if(!!isValid && !isValid(paintX, paintY))
                  continue;

                const xLookup = this.cursorFlipX ? w - 1 - x1 : x1;
                const yLookup = this.cursorFlipY ? h - 1 - y1 : y1;

                const paintI = paintX + paintY * level.width;
                const tile = stamp.tiles[xLookup + yLookup * w];
                const tileIndex = this.applicationState.tiles.indexOf(tile);

                level.tiles[paintI] = tileIndex|paletteMask|flipMask;
              }
            }
          }

          switch(this.applicationState.drawMode){
            case 'b':
              const validCoords = this.seekBucketFillCoords(level, this.cursorX, this.cursorY),
                    validateCoords = (x: number, y: number) => validCoords.findIndex(coord => coord[0] === x && coord[1] == y) >= 0;

              for(let x = -(w - this.cursorX % w); x < level.width; x += w){
                for(let y = -(h - this.cursorY % h); y < level.height; y += h){
                  drawFunc(level, x, y, validateCoords)
                }
              }

              break;
            default:
                drawFunc(level, this.cursorX, this.cursorY);
              break;
          }   
        }
        break;
      case 'eraser':
        for(let x = Math.min(this.cursorX + this.applicationState.eraserWidth, level.width) - 1; x >= this.cursorX; --x){
          for(let y = Math.min(this.cursorY + this.applicationState.eraserHeight, level.height) - 1; y >= this.cursorY; --y){
            level.tiles[x + y * level.width] = -1;
          }
        }
        break;
      case 'patterns':
        if(!this.applicationState.activePattern)
          return;

        const pattern = this.applicationState.activePattern,
              w = pattern.width,
              h = pattern.height;

        const drawFunc = (level: Level, startX: number, startY: number, isValid?: ValidateCoordsDelegate) => {
          for(let x = w - 1; x >= 0; --x){
            for(let y = h - 1; y >= 0; --y){
              let destX = startX + x;
              let destY = startY + y;

              if(destX < 0 || destY < 0 || destX >= level.width || destY >= level.height)
                continue;

              if(!!isValid && !isValid(destX, destY))
                continue;

              let xsrc = this.cursorFlipX ? w - 1 - x : x;
              let ysrc = this.cursorFlipY ? h - 1 - y : y;

              let i = xsrc + ysrc * pattern.width;

              let tile = pattern.tiles[i];

              if(this.ignoreBlanks && tile === -1)
                continue;

              level.tiles[destX + destY * level.width] = tile === -1 ? tile : tile ^ flipMask;
            }
          }

        }

        switch(this.applicationState.drawMode){
          case 'b':
            const validCoords = this.seekBucketFillCoords(level, this.cursorX, this.cursorY),
                  validateCoords = (x: number, y: number) => validCoords.findIndex(coord => coord[0] === x && coord[1] == y) >= 0;

            for(let x = -(w - this.cursorX % w); x < level.width; x += w){
              for(let y = -(h - this.cursorY % h); y < level.height; y += h){
                drawFunc(level, x, y, validateCoords)
              }
            }

            break;
          default:
              drawFunc(level, this.cursorX, this.cursorY);
            break;
        }   
        break;
      case 'tiles':
      default:
        if(!!this.applicationState.activeTile){
          const newTile = this.applicationState.tiles.indexOf(this.applicationState.activeTile)|paletteMask|flipMask
          switch(this.applicationState.drawMode){
            case 'b':{
              if(level.tiles[i] === newTile)
                return;

              this.seekBucketFillCoords(level, this.cursorX, this.cursorY)
                .forEach(coord => level.tiles[coord[0] + coord[1] * level.width] = newTile);
            }
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

  // Drawing utilities
  /**
   * Seeks a range of tiles to use as a bucket fill target
   * @param level 
   * @param startX 
   * @param startY 
   */
  seekBucketFillCoords(level: Level, startX: number, startY: number){
    const visitedTiles = new Uint8Array(level.tiles.length).fill(0);
    const tileToSeek = level.tiles[startX + startY * level.width];

    const stack = [[startX, startY]];
    const coordsToFill = [];

    while(!!stack.length){
      const coord = stack.pop();
      if(coord[0] < 0 || coord[0] >= level.width || coord[1] < 0 || coord[1] >= level.height){
        continue;
      }

      const i = coord[0] + coord[1] * level.width;
      if(level.tiles[i] !== tileToSeek)
        continue;

      if(visitedTiles[i] !== 0)
        continue;

      coordsToFill.push(coord);
      visitedTiles[i] = 1;

      stack.push([coord[0],coord[1]+1],
        [coord[0], coord[1]-1],
        [coord[0]+1, coord[1]],
        [coord[0]-1, coord[1]]);
    }

    //Return coords sorted by row and column
    return coordsToFill.sort((a, b) => {
        const cmp = a[1] - b[1];
        if(cmp !== 0)
          return cmp;

        return a[0] - b[0];
      });
  }

  getSteppedFillCoords(coords: number[][], stepX: number, stepY: number){
    if(!coords || !coords.length)
      return [];

    const b = [coords[0]];
    for(let i = 1; i < coords.length; ++i){
      const lastCoord = b[b.length - 1],
            currentCoord = coords[i];

      if(Math.abs(currentCoord[0] - lastCoord[0]) >= stepX && Math.abs(currentCoord[1] - lastCoord[1]) >= stepY)
        b.push(currentCoord);
    }
	  return b;
  }

  bucketFill(level: Level, startX: number, startY: number, seekCoordsDelegate:SeekCoordsDelegate, tileDelegate: TileDelegate){
    const tileToChange = level.tiles[startX + startY * level.width];
    const stack = [[startX, startY]];
    while(!!stack.length){
      const coord = stack.pop();
      if(coord[0] < 0 || coord[0] >= level.width || coord[1] < 0 || coord[1] >= level.height){
        continue;
      }

      const i = coord[0] + coord[1] * level.width;
      if(level.tiles[i] !== tileToChange)
        continue;

      tileDelegate(level, coord[0] - startX, coord[1] - startY);

      stack.push(...seekCoordsDelegate(coord));
    }
  }

  getPaletteMask(){
    switch(this.applicationState.palettes.indexOf(this.applicationState.activePalette)){
      case 1:
        return 0x2000;
      case 2:
        return 0x4000;
      case 3:
        return 0x6000;
      case 0:
      default:
        return 0;
    }
  }

  getFlipMask(){
    let flipMask = 0;
    if(!!this.cursorFlipX)
      flipMask |= hflipFlag;
    if(!!this.cursorFlipY)
      flipMask |= vflipFlag;

    return flipMask;
  } 

  //Img proessing

  importImageClick(ev: MouseEvent){
    this.showImageSelection = true;
  }

  onImageProcessed(image: PalettizedImage){
    if(!!image && !!image.indices){
      const imageIndices = image.indices;
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
          let tileIndex = -1;
          
          for(let i = this.applicationState.tiles.length - 1; i >= 0; --i){
            const tile = this.applicationState.tiles[i];
            const cmp = TileUtils.tileCmpAll(tileCursor, tile);

            if(cmp === -1)
              continue;

            tileIndex = i;

            if(cmp === 1){
              tileIndex |= hflipFlag;
            }else if(cmp === 2){
              tileIndex |= vflipFlag;
            }else if(cmp === 3){
              tileIndex |= hflipFlag|vflipFlag;
            }

            break;
          }
          
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
