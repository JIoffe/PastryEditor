import { Component, OnInit, ViewChild, ElementRef, Input, OnChanges } from '@angular/core';
import { BaseSubscriberComponent } from '../base-subscriber.component';
import { ApplicationState } from 'src/services/application-state';
import { Stamp } from 'src/model/stamp';
import { TileRenderer } from 'src/services/tile-renderer';
import { PalettizedImage } from 'src/model/palettized-image';

@Component({
  selector: 'app-multi-tile-editor',
  templateUrl: './multi-tile-editor.component.html',
  styleUrls: ['./multi-tile-editor.component.css']
})
export class MultiTileEditorComponent  extends BaseSubscriberComponent implements OnInit, OnChanges {
  @Input() title: string = 'Edit Graphic';
  @Input() stamp: Stamp = null;

  @ViewChild('canvasContainer', null) canvasContainer:ElementRef;
  @ViewChild('drawCanvas', null) drawCanvas:ElementRef;
  @ViewChild('grid', null) grid:ElementRef;
  

  backgroundMode:string = 'backdrop';

  code:string = null;
  zoom = 100.0;
  showGrid = true;
  
  showImageSelection = false;

  constructor(private applicationState: ApplicationState, private tileRenderer: TileRenderer) {
    super();
  }

  get width(){
    return this.stamp.width;
  }

  get height(){
    return this.stamp.height;
  }

  get maxWidth(){
    if(!this.canvasContainer)
      return 0;

    var r = this.canvasContainer.nativeElement.getBoundingClientRect();
    return r.right - r.left;
  }

  get maxHeight(){
    if(!this.canvasContainer)
      return 0;

    var r = this.canvasContainer.nativeElement.getBoundingClientRect();
    return r.bottom - r.top;
  }

  ngOnInit() {
    this.subscribe(
      this.applicationState.PaletteObservable.subscribe(palette => {
        this.redrawCanvas();
      })
    )

    this.redrawGrid();
    this.redrawCanvas();
  }

  ngOnChanges(changes: import("@angular/core").SimpleChanges): void {
    this.redrawCanvas();
    this.redrawGrid();
  }

  onZoomChange(){
    this.redrawGrid();
    this.redrawCanvas();
  }

  onDraw(ev: MouseEvent){
    if(ev.buttons === 0)
      return;

    //The client rect moves with the parent's scroll
    const canvas = this.drawCanvas.nativeElement,
          ctx    = canvas.getContext('2d'),
          rect  = canvas.getBoundingClientRect(),
          w    = rect.right - rect.left,
          h    = rect.bottom - rect.top;

    const x = Math.floor(((ev.pageX - rect.left) / w) * this.stamp.width  * 8),
          y = Math.floor(((ev.pageY - rect.top)  / h) * this.stamp.height * 8);

    const buffer = ctx.getImageData(0, 0, this.stamp.width  * 8, this.stamp.height * 8),
          data = buffer.data;

    switch(this.applicationState.drawMode){
      case 'b':
        {
          const indexToChange = this.stamp.getTexel(x, y);
          if(indexToChange !== this.applicationState.activeColor){
            const stack = [[x,y]];
            const dirtyTilesSet = new Set<Uint8Array>();
            while(!!stack.length){
              const coords = stack.pop();
              const indexAtCoords = this.stamp.getTexel(coords[0], coords[1]);
              if(indexAtCoords === indexToChange){
                dirtyTilesSet.add(this.stamp.setTexel(coords[0], coords[1], this.applicationState.activeColor));
                const pixelI = (coords[0] + coords[1] * this.stamp.width  * 8) * 4,
                      color = this.applicationState.activePalette[this.applicationState.activeColor];

                data[pixelI] = color.r;
                data[pixelI + 1] = color.g;
                data[pixelI + 2] = color.b;
                data[pixelI + 3] = 255;
  
                stack.push(
                  [coords[0], coords[1]+1],
                  [coords[0], coords[1]-1],
                  [coords[0]+1, coords[1]],
                  [coords[0]-1, coords[1]]);
              }
            }
            Array.from(dirtyTilesSet).forEach(t => this.applicationState.TileUpdatedObservable.next(t));
          }
        }
        break;
      case 'p':
      default:
        {
          const updatedTile = this.stamp.setTexel(x, y, this.applicationState.activeColor);
          this.applicationState.TileUpdatedObservable.next(updatedTile);

          const pixelI = (x + y * this.stamp.width  * 8) * 4,
                color = this.applicationState.activePalette[this.applicationState.activeColor];
                
          data[pixelI] = color.r;
          data[pixelI + 1] = color.g;
          data[pixelI + 2] = color.b;
          data[pixelI + 3] = 255;
        }
        break;
    }

    ctx.putImageData(buffer, 0, 0);
  }

  redrawGrid(){
    const canvas = this.grid.nativeElement,
          ctx    = canvas.getContext('2d'),
          rect   = canvas.getBoundingClientRect(),
          w      = rect.right  - rect.left,
          h      = rect.bottom - rect.top;

    canvas.setAttribute('width', '' + w);
    canvas.setAttribute('height', '' + h);

    ctx.fillStyle = "rgba(0, 0, 0, 0)";
    ctx.fillRect(0,0,w,h);

    const stepX = w / (this.stamp.width * 8);
    const stepY = h / (this.stamp.height * 8);

    ctx.strokeStyle = '#FFF';

    for(let x = 0; x < w; x += stepX){
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }

    for(let y = 0; y < h; y += stepY){
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
  }

  redrawCanvas(){
    //View is disabled
    if(!this.drawCanvas || !this.stamp)
      return;

    const w = this.stamp.width * 8,
          h = this.stamp.height * 8,
          canvas = this.drawCanvas.nativeElement;

    canvas.setAttribute('width', w + '');
    canvas.setAttribute('height', h + '');

    const ctx = canvas.getContext('2d');
    const buffer = ctx.createImageData(w, h);
    const data = buffer.data;

    for(let x = w - 1; x >= 0; --x){
      for(let y = h - 1; y >= 0; --y){
        const i = (x + y * w) * 4;
        let color = this.applicationState.activePalette[this.stamp.getTexel(x, y)];
        data[i] = color.r;
        data[i + 1] = color.g;
        data[i + 2] = color.b;
        data[i + 3] = 255;
      }
    }

    ctx.putImageData(buffer, 0, 0);
  }

  importImageClick(ev: MouseEvent){
    this.showImageSelection = true;
  }

  onImageProcessed(image: PalettizedImage){
    if(!!image && !!image.indices){
      const imageIndices = image.indices;

      const w = this.stamp.width * 8;

      const updatedTilesSet = new Set<Uint8Array>();
      for(let i = 0; i < imageIndices.length; ++i){
        const x = i % w,
              y = Math.floor(i / w);

        const updatedTile = this.stamp.setTexel(x, y, imageIndices[i]);
        updatedTilesSet.add(updatedTile);
      }

      updatedTilesSet.forEach(tile => this.applicationState.TileUpdatedObservable.next(tile));
    }
    this.showImageSelection = false;
  }


  code_onClick(ev: MouseEvent){

  }

  onCodeChanged(code: string){

  }
}
