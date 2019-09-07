import { Component, OnInit, ViewChild, ElementRef, Input, OnChanges } from '@angular/core';
import { BaseSubscriberComponent } from '../base-subscriber.component';
import { ApplicationState } from 'src/services/application-state';
import { Stamp } from 'src/model/stamp';
import { TileRenderer } from 'src/services/tile-renderer';

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
      }),

      this.applicationState.TileUpdatedObservable.subscribe(tile => {
        if(!this.stamp)
          return;
        
        const tileIndex = this.stamp.tiles.indexOf(tile);
        if(tileIndex >= 0){
          this.redrawCanvasWhereDirty(tileIndex);
        }
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
  }

  onDraw(ev: MouseEvent){
    if(ev.buttons === 0)
      return;

    //The client rect moves with the parent's scroll
    const rect = this.drawCanvas.nativeElement.getBoundingClientRect(),
          w    = rect.right - rect.left,
          h    = rect.bottom - rect.top;

    const x = Math.floor(((ev.pageX - rect.left) / w) * this.stamp.width  * 8),
          y = Math.floor(((ev.pageY - rect.top)  / h) * this.stamp.height * 8);

    const updatedTile = this.stamp.setTexel(x, y, this.applicationState.activeColor);
    this.applicationState.TileUpdatedObservable.next(updatedTile);
  }

  redrawGrid(){
    const canvas = this.grid.nativeElement,
          ctx    = canvas.getContext('2d'),
          rect   = canvas.getBoundingClientRect(),
          w      = rect.right  - rect.left,
          h      = rect.bottom - rect.top;

    canvas.setAttribute('width', '' + w);
    canvas.setAttribute('height', '' + h);

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

  redrawCanvasWhereDirty(tileIndex: number){
    const ctx = this.drawCanvas.nativeElement.getContext('2d');
    const imageData = this.tileRenderer.renderTileImageData(ctx, this.stamp.tiles[tileIndex], this.applicationState.activePalette);

    const pos = this.stamp.getTilePos(tileIndex);
    
    ctx.putImageData(imageData, pos[0], pos[1]);
  }

  redrawCanvas(){
    //View is disabled
    if(!this.drawCanvas || !this.stamp)
      return;

    this.drawCanvas.nativeElement.setAttribute('width', this.stamp.width * 8 + '');
    this.drawCanvas.nativeElement.setAttribute('height', this.stamp.height * 8 + '');

    for(let i = this.stamp.tiles.length - 1; i >= 0; --i){
      this.redrawCanvasWhereDirty(i);
    }
  }

  importImageClick(ev: MouseEvent){
    this.showImageSelection = true;
  }

  onImageProcessed(imageIndices: Uint8Array){
    if(!!imageIndices){
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
