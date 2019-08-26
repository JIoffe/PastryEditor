import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { ApplicationState } from 'src/services/application-state';
import { Color } from 'src/model/color';
import { ColorKMeansSolver } from 'src/services/color-k-means-solver';

@Component({
  selector: 'app-image-importer',
  templateUrl: './image-importer.component.html',
  styleUrls: ['./image-importer.component.css']
})
export class ImageImporterComponent implements OnInit {
  @Input() width: number;
  @Input() height: number;
  @ViewChild('imageImportCanvas', null) imageImportCanvas:ElementRef;
  @ViewChild('imageImportSource', null) imageImportSource:ElementRef;
  @Output() imageProcessed = new EventEmitter<Uint8Array>();
  selectedImage = null;
  ditheringMode = 'none';

  palette: Color[];

  paletteSelection: string;
  customPalette: Color[] = null;

  constructor(private applicationState: ApplicationState, private colorKMeansSolver: ColorKMeansSolver) { }

  ngOnInit() {
    this.paletteSelection = "0";
    this.palette = this.applicationState.activePalette;
  }

  ok_click(ev: MouseEvent){
    const w = this.width  * 8,
          h = this.height * 8;

    const ctx = this.imageImportCanvas.nativeElement.getContext('2d');
    const imageData = ctx.getImageData(0, 0, w, h);

    if(this.paletteSelection === '-1'){
      //Replace palette
      for(let i = 0; i < 16; ++i){
        var target = this.applicationState.activePalette[i];
        var src = this.customPalette[i];

        target.r = src.r;
        target.g = src.g;
        target.b = src.b;
      }
    }

    const indices = new Uint8Array(w * h);
    for(let i = 0; i < w * h; ++i){
      const pixelI = i * 4;
      const r = imageData.data[pixelI],
            g = imageData.data[pixelI + 1],
            b = imageData.data[pixelI + 2];

      for(let j = 15; j >= 0; --j){
        const color = this.palette[j];
        if(color.r === r && color.g === g && color.b === b){
          indices[i] = j;
          break;
        }
      }     
    }

    this.selectedImage = null;
    this.customPalette = null;
    this.imageProcessed.emit(indices);
  }

  cancel_click(ev: MouseEvent){
    this.selectedImage = null;
    this.imageProcessed.emit(null);
  }

  onPaletteChange(ev: any){
    this.reprocessImage();
  }

  onImagePaste(ev: ClipboardEvent){
    let url = ev.clipboardData.getData("text/plain");
    if(!!url && !!url.length){
      this.selectedImage = url;
      this.customPalette = null;
      this.reprocessImage();
      return;
    }
  }

  reprocessImage(){
    const w = this.width  * 8,
          h = this.height * 8;

    const img = <HTMLImageElement>this.imageImportSource.nativeElement;

    var proc = () => {
      this.imageImportCanvas.nativeElement.setAttribute('width', w + '');
      this.imageImportCanvas.nativeElement.setAttribute('height', h + '');

      const ctx = this.imageImportCanvas.nativeElement.getContext('2d');

      ctx.drawImage(img, 0, 0, w, h);

      const srcImageData = ctx.getImageData(0, 0, w, h);
      const targetImageData = ctx.createImageData(w, h);

      //Determine palette for K Means
      if(this.customPalette === null){
        const srcColors = Color.getDistinctColorsFromImageData(srcImageData);
        // srcColors.forEach(c => c.clampToSegaMD());
  
        //15 colors - first one is transparent!
        const reducedPalette = this.colorKMeansSolver.SolveKMeans(srcColors, 15, 500);
        reducedPalette.forEach(c => c.clampToSegaMD());

        //Sometimes this is out of date
        if(!!reducedPalette.find(c => c.r + c.g + c.b > 0)){
          this.customPalette = [new Color(0,0,0)];
          this.customPalette.push(...reducedPalette);
        }
      }

      if(+this.paletteSelection >= 0){
        this.palette = this.applicationState.palettes[this.paletteSelection];
      }else{
        this.palette = this.customPalette;
      }


      //Use anything but the backdrop
      const palette = this.palette.slice(1);

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

                let colorMatch = Color.getNearestColor(palette, r, g, b);

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
                let colorMatch = Color.getNearestColor(palette, srcR, srcG, srcB);

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
}
