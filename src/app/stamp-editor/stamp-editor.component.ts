import { Component, OnInit, Input, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { Color } from 'src/model/color';
import { ApplicationState } from 'src/services/application-state';
import { Stamp } from 'src/model/stamp';
import { BaseSubscriberComponent } from '../base-subscriber.component';
import { TileRenderer } from 'src/services/tile-renderer';

@Component({
  selector: 'app-stamp-editor',
  templateUrl: './stamp-editor.component.html',
  styleUrls: ['./stamp-editor.component.css']
})
export class StampEditorComponent extends BaseSubscriberComponent implements OnInit {
  @ViewChild('canvasContainer', null) canvasContainer:ElementRef;
  @ViewChild('drawCanvas', null) drawCanvas:ElementRef;
  @Input() stamp: Stamp = null;

  code = null;
  zoom = 100.0;

  backgroundMode = 'backdrop';

  showImageSelection = false;

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
  
  constructor(private applicationState: ApplicationState, private tileRenderer: TileRenderer) {
    super();
  }

  ngOnInit() {
    this.stamp = this.applicationState.activeStamp;

    this.subscribe(
      this.applicationState.PaletteObservable.subscribe(palette => {
        this.redrawCanvas();
      }),
  
      this.applicationState.StampSelectedObservable.subscribe(stamp => {
        this.stamp = stamp;
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

    this.redrawCanvas();
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

  redrawCanvasWhereDirty(tileIndex: number){
    const ctx = this.drawCanvas.nativeElement.getContext('2d');
    const imageData = this.tileRenderer.renderTileImageData(ctx, this.stamp.tiles[tileIndex], this.applicationState.activePalette);

    const x = (tileIndex % this.stamp.width) * 8,
          y = Math.floor(tileIndex / this.stamp.width) * 8;
    
    ctx.putImageData(imageData, x, y);
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

  code_onClick(ev: MouseEvent){

  }
  
  changeZoom(ev: MouseEvent, delta: number){
    this.zoom = Math.max(0.1, this.zoom + delta);
  }

  // Image import callbacks

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

  // diffuseError(imageData: ImageData, errorMatrix, x, y){

  // }
}
