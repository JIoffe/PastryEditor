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
  @ViewChild('imageImportCanvas', null) imageImportCanvas:ElementRef;
  @ViewChild('imageImportSource', null) imageImportSource:ElementRef;
  @Input() stamp: Stamp = null;

  code = null;
  zoom = 100.0;

  backgroundMode = 'backdrop';

  showImageSelection = false;
  selectedImage = null;
  ditheringMode = 'none';

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

  ok_click(ev: MouseEvent){
    this.showImageSelection = false;
    this.selectedImage = null;
  }

  cancel_click(ev: MouseEvent){
    this.showImageSelection = false;
    this.selectedImage = null;
  }

  onImagePaste(ev: ClipboardEvent){
    let url = ev.clipboardData.getData("text/plain");
    if(!!url && !!url.length){
      this.selectedImage = url;
      this.reprocessImage();
      return;
    }
  }

  reprocessImage(){
    const w = this.stamp.width  * 8,
          h = this.stamp.height * 8;

    const img = <HTMLImageElement>this.imageImportSource.nativeElement;

    var proc = () => {
      this.imageImportCanvas.nativeElement.setAttribute('width', w + '');
      this.imageImportCanvas.nativeElement.setAttribute('height', h + '');

      const ctx = this.imageImportCanvas.nativeElement.getContext('2d');

      ctx.drawImage(img, 0, 0, w, h);

      const srcImageData = ctx.getImageData(0, 0, w, h);
      const targetImageData = ctx.createImageData(w, h);

      for(let y = 0; y < h; ++y){
        for(let x = 0; x < w; ++x){
          const i = x + y * w,
            pixelI = i*4;

          let srcR = srcImageData.data[pixelI],
            srcG = srcImageData.data[pixelI + 1],
            srcB = srcImageData.data[pixelI + 2];

          //Dithering is an application of error diffusion.
          //Forward propagate the errors to better simulate gradients
          switch(this.ditheringMode){
            case 'floyd-steinberg':
              {
                  /*
                        x   7
                    3   5   1
                    
                      (1/16)
                  */

                  /*
                         0 0 0 0 0 0 0 0
                         0 0 0 0 0 0 0 0
                         0 0 0 0 0 0 0 0
                         0 0 0 0 0 0 0 0
                         0 0 0 0 0 0 0 0
                         0 0 0 0 0 0 0 0
                  */
                let r = targetImageData.data[pixelI] + srcImageData.data[pixelI],
                    g = targetImageData.data[pixelI + 1] + srcImageData.data[pixelI + 1],
                    b = targetImageData.data[pixelI + 2] + srcImageData.data[pixelI + 2];

                let colorMatch = Color.getNearestColor(this.applicationState.activePalette, r, g, b);

                let errorR = (r - colorMatch.r) >> 4,
                    errorG = (g - colorMatch.g) >> 4,
                    errorB = (b - colorMatch.b) >> 4;

                targetImageData.data[pixelI] = colorMatch.r;
                targetImageData.data[pixelI + 1] = colorMatch.g;
                targetImageData.data[pixelI + 2] = colorMatch.b;
                targetImageData.data[pixelI + 3] = 255;

                // //Apply error to neighboring pixels
                let neighbor;
                if(x > 0 && y < h - 1){
                  neighbor = (pixelI + w * 4) - 4;
                  targetImageData.data[neighbor] += errorR * 3;
                  targetImageData.data[neighbor + 1] += errorG * 3;
                  targetImageData.data[neighbor + 2] += errorB * 3;
                }

                if(x < w - 1){
                  neighbor = pixelI + 4;
                  targetImageData.data[neighbor] += errorR * 7;
                  targetImageData.data[neighbor + 1] += errorG * 7;
                  targetImageData.data[neighbor + 2] += errorB * 7;
                }

                if( y < h - 1){
                  neighbor = pixelI + w * 4;
                  targetImageData.data[neighbor] += errorR * 5;
                  targetImageData.data[neighbor + 1] += errorG * 5;
                  targetImageData.data[neighbor + 2] += errorB * 5;
                }

                if(y < h - 1 && x < w - 1){
                  neighbor = pixelI + 4 + w * 4;
                  targetImageData.data[neighbor] += errorR;
                  targetImageData.data[neighbor + 1] += errorG;
                  targetImageData.data[neighbor + 2] += errorB;
                }
              }
              break;
            default:
              {
                let colorMatch = Color.getNearestColor(this.applicationState.activePalette, srcR, srcG, srcB);

                targetImageData.data[pixelI] = colorMatch.r;
                targetImageData.data[pixelI + 1] = colorMatch.g;
                targetImageData.data[pixelI + 2] = colorMatch.b;
                targetImageData.data[pixelI + 3] = 255;
              }
              break;
          }
        }
      }

      ctx.putImageData(targetImageData, 0, 0);
    };

    img.onload = proc;
    if(!!img.complete)
      proc();
  }

  // diffuseError(imageData: ImageData, errorMatrix, x, y){

  // }
}
