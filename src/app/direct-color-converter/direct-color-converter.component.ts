import { Component, ViewChild, ElementRef } from '@angular/core';
import { Color } from 'src/model/color';

@Component({
  selector: 'app-direct-color-converter',
  templateUrl: './direct-color-converter.component.html',
  styleUrls: ['./direct-color-converter.component.css']
})
export class DirectColorConverterComponent  {
  @ViewChild('image', null) image:ElementRef;
  code = '';
  selectedImage = null;

  constructor() { }

  onImagePaste(ev: ClipboardEvent){
    let imgItem = Array.from(ev.clipboardData.items).find(i => i.type.indexOf('image') >= 0);
    if(!!imgItem){
      //Use the FileReader API to convert this blob to a base64 string
      let blob = imgItem.getAsFile();

      const reader = new FileReader();
      reader.onload = ev => {
        this.selectedImage = (<any>ev.target).result;
      };

      reader.readAsDataURL(blob);
      return;
    }
  }

  reprocessImage(){
    const img = <HTMLImageElement>this.image.nativeElement;

    const w = img.naturalWidth || img.width,
          h = img.naturalHeight || img.height;

    const canvas = document.createElement('canvas');
    canvas.setAttribute('width', '' + w);
    canvas.setAttribute('height', '' + h);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, w, h);
    const srcImageData = ctx.getImageData(0, 0, w, h),
          data = srcImageData.data;
    
    this.code = `; ${w} x ${h}\r\n`;
    for(let y = 0; y < h; ++y){
      const colors: Color[] = [];
      for(let x = 0; x < w; ++x){
        const i = (x + y * w) * 4;
        const r = data[i],
              g = data[i + 1],
              b = data[i + 2];

        const color = new Color(r,g,b);
        color.clampToSegaMD();

        colors.push(color);
      }

      const colorCode = colors.map(c => c.toSegaMDString()).join(',');
      this.code += `  dc.w  ${colorCode}\r\n`
    }
  }
}
