import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { ApplicationState } from 'src/services/application-state';
import { Color } from 'src/model/color';
import { ColorKMeansSolver } from 'src/services/color-k-means-solver';
import { ImageQuantizer } from 'src/services/image-quantizer';
import { PalettizedImage } from 'src/model/palettized-image';

@Component({
  selector: 'app-image-importer',
  templateUrl: './image-importer.component.html',
  styleUrls: ['./image-importer.component.css']
})
export class ImageImporterComponent implements OnInit {
  @Input() width: number = -1;
  @Input() height: number = -1;
  @Input() useNaturalSize: boolean = false;
  
  @ViewChild('imageImportCanvas', null) imageImportCanvas:ElementRef;
  @ViewChild('imageImportSource', null) imageImportSource:ElementRef;
  @Output() imageProcessed = new EventEmitter<PalettizedImage>();
  selectedImage = null;
  ditheringMode = 'none';

  palette: Color[];

  paletteSelection: number;
  transparencySelection: string;
  customPalette: Color[] = null;

  constructor(private applicationState: ApplicationState, private colorKMeansSolver: ColorKMeansSolver, private imageQuantizer: ImageQuantizer) { }

  ngOnInit() {
    this.paletteSelection = 0;
    this.transparencySelection = "none";
    this.palette = this.applicationState.activePalette;
  }

  ok_click(ev: MouseEvent){
    let w: number, h: number;
    if(this.useNaturalSize){
      w = this.width;
      h = this.height;
    }else{
      w = this.width * 8;
      h = this.height * 8;
    }

    const ctx = this.imageImportCanvas.nativeElement.getContext('2d');
    const imageData = ctx.getImageData(0, 0, w, h);

    if(this.paletteSelection === -1){
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
            b = imageData.data[pixelI + 2],
            a = imageData.data[pixelI + 3];

      if(a === 0){
        indices[i] = 0;
        continue;
      }

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
    this.imageProcessed.emit({
      width: w,
      height: h,
      indices: indices
    });
  }

  cancel_click(ev: MouseEvent){
    this.selectedImage = null;
    this.imageProcessed.emit(null);
  }

  onPaletteChange(ev: any){
    this.reprocessImage();
  }

  onTransparencyChange(ev: any){
    this.reprocessImage();
  }

  onImagePaste(ev: ClipboardEvent){
    let url = ev.clipboardData.getData("text/plain");
    if(!!url && !!url.length){
      this.selectedImage = url;
      this.customPalette = null;
      return;
    }

    let imgItem = Array.from(ev.clipboardData.items).find(i => i.type.indexOf('image') >= 0);
    if(!!imgItem){
      //Use the FileReader API to convert this blob to a base64 string
      let blob = imgItem.getAsFile();

      const reader = new FileReader();
      reader.onload = ev => {
        this.selectedImage = (<any>ev.target).result;
        this.customPalette = null;
      };

      reader.readAsDataURL(blob);
      return;
    }
  }

  reprocessImage(){
    const img = <HTMLImageElement>this.imageImportSource.nativeElement;

    let w: number,
    h: number;

    if(this.useNaturalSize){
      w = img.naturalWidth || img.width
      h = img.naturalHeight || img.height

      this.width = w;
      this.height = h;
    }else{
      w = this.width  * 8;
      h = this.height * 8;
    }

    var proc = async () => {
      //Style images to keep image's aspect ratio for preview purposes
      let aspect = h / w;

      this.imageImportCanvas.nativeElement.setAttribute('width', w + '');
      this.imageImportCanvas.nativeElement.setAttribute('height', h + '');

      let displayWidth = 400;
      let displayHeight = aspect * displayWidth;

      //Style the canvas to fit within a 400px sized bound
      //There should probably be a pure Angular or CSS way to do this
      let maxDisplay = Math.max(displayWidth, displayHeight);
      if(maxDisplay > 400){
        let factor = maxDisplay / 400;
        displayHeight /= factor;
        displayWidth /= factor;
      }

      this.imageImportCanvas.nativeElement.style.width = `${displayWidth}px`;
      this.imageImportCanvas.nativeElement.style.height = `${displayHeight}px`;

      const ctx = this.imageImportCanvas.nativeElement.getContext('2d');

      ctx.drawImage(img, 0, 0, w, h);
      const srcImageData = ctx.getImageData(0, 0, w, h);

      let transparentColor: Color = null;
      if(this.transparencySelection === 'upper-left'){
        transparentColor = new Color(srcImageData.data[0], srcImageData.data[1], srcImageData.data[2]);
      }

      this.customPalette = await this.getCustomPalette(srcImageData, transparentColor);

      
      if(this.paletteSelection >= 0){
        this.palette = this.applicationState.palettes[this.paletteSelection];
      }else{
        this.palette = this.customPalette;
      }

      const q = await this.imageQuantizer.quantizeImage(srcImageData.data, this.palette, w, h, this.ditheringMode);
      this.customPalette[0].clampToSegaMD();

      const targetImageData = ctx.createImageData(w, h);
      const n = w * h * 4;
      for(let i = n - 1; i >= 0; --i){
        targetImageData.data[i] = q[i];
      }

      ctx.putImageData(targetImageData, 0, 0);
    };

    img.onload = proc;
    if(!!img.complete && img.naturalWidth > 0)
      proc();
  }

  async getCustomPalette(srcImageData: ImageData, transparentColor: Color) : Promise<Color[]>{
    //Determine palette for K Means
    if(!!this.customPalette)
      return this.customPalette;

    let srcColors = await Color.getDistinctColors(srcImageData.data);
    
    if(transparentColor !== null){
      srcColors = srcColors.filter(c => !c.equals(transparentColor));
    }

    let reducedPalette;

    if(srcColors.length <= 15){
      reducedPalette = srcColors;
    }else{
      srcColors.forEach(c => c.clampToSegaMD());

      //15 colors - first one is transparent!
      reducedPalette = await this.colorKMeansSolver.SolveKMeans(srcColors, 15, 500);
    }

    reducedPalette.forEach(c => c.clampToSegaMD());

    //Sometimes this is out of date
    if(!!reducedPalette.find(c => c.r + c.g + c.b > 0)){
      this.customPalette = [transparentColor || new Color(0,0,0)];
      this.customPalette.push(...reducedPalette);
      while(this.customPalette.length < 16){
        this.customPalette.push(new Color(0,0,0));
      }
    }

    return this.customPalette;
  }
}
