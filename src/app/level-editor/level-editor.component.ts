import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ApplicationState } from 'src/services/application-state';
import { ChildrenOutletContexts } from '@angular/router';
import { BaseSubscriberComponent } from '../base-subscriber.component';

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

  buffer: ImageData;

  cursorX = 0;
  cursorY = 0;

  cursorDisplayX = 0;
  cursorDisplayY = 0;
  
  constructor(private applicationState: ApplicationState) { 
    super();
  }

  ngOnInit() {
    const canvas  = this.canvas.nativeElement,
    rect    = canvas.getBoundingClientRect(),
    w       = rect.right - rect.left,
    h       = rect.bottom - rect.top;

    canvas.setAttribute('width', w + '');
    canvas.setAttribute('height', h + '');

    const ctx = canvas.getContext('2d');

    this.buffer = ctx.createImageData(w, h);

    this.render();

    this.subscribe(
      this.applicationState.LevelSelectedObservable.subscribe(level => {
        this.render();
      })
    );
  }

  onZoomChange(){
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
    this.cursorDisplayY = this.cursorY*pixelSize + 24 - scrollTop;

    if(ev.buttons === 0)
      return;

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

                const paintI = paintX + paintY * level.width;
                const tile = stamp.tiles[x1 + y1 * stamp.width];
                const tileIndex = this.applicationState.tiles.indexOf(tile);

                level.palettes[paintI] = this.applicationState.palettes.indexOf(this.applicationState.activePalette);
                level.tiles[paintI] = tileIndex;
              }
            }
          }
        }
        break;
      case 'tiles':
      default:
        if(!!this.applicationState.activeTile){
          level.palettes[i] = this.applicationState.palettes.indexOf(this.applicationState.activePalette);
          level.tiles[i] = this.applicationState.tiles.indexOf(this.applicationState.activeTile);
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
          w       = rect.right - rect.left,
          h       = rect.bottom - rect.top;

    canvas.setAttribute('width', w + '');
    canvas.setAttribute('height', h + '');

    const ctx = canvas.getContext('2d');
    const data = this.buffer.data;

    for(let x = w; x >= 0; --x){
      for(let y = h; y >= 0; --y){
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

        let palette = this.applicationState.palettes[level.palettes[levelTileI]];

        const tile = this.applicationState.tiles[tileIndex];
        const indexX = Math.floor((factorX - tileX) * 8),
              indexY = Math.floor((factorY - tileY) * 8),
              index = tile[indexX + indexY * 8],
              color = palette[index];

        data[i] = color.r;
        data[i + 1] = color.g;
        data[i + 2] = color.b;
        data[i + 3] = 255;
      }
    }

    ctx.putImageData(this.buffer, 0, 0);
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
}
