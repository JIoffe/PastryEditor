import { Injectable } from '@angular/core';
import { Stamp } from 'src/model/stamp';
import { Color } from 'src/model/color';

@Injectable({
    providedIn: 'root',
})
export class TileRenderer{
    private canvas: HTMLCanvasElement;
    private ctx: any;

    constructor(){
        this.canvas = document.createElement('canvas');
        this.canvas.setAttribute('width', '8');
        this.canvas.setAttribute('height', '8');
        this.ctx = this.canvas.getContext('2d');
    }

    renderTileDataUrl(tile: Uint8Array, palette: Color[]){
        const imageData = this.renderTileImageData(this.ctx, tile, palette);
        this.ctx.putImageData(imageData, 0, 0);

        return this.canvas.toDataURL("image/png");
    }

    renderTileImageData(ctx: any, tile: Uint8Array, palette: Color[]){
        const imageData = ctx.createImageData(8, 8),
              data      = imageData.data;

        for(let x = 0; x < 8; ++x){
          for(let y = 0; y < 8; ++y){
            const i = x + y * 8,
                  colorIndex = tile[i],
                  pixelI = i * 4;

            if(colorIndex === 0){
                //Save transparent pixels as actually transparent
                data[pixelI] = 0;
                data[pixelI + 1] = 0;
                data[pixelI + 2] = 0;
                data[pixelI + 3] = 0; 
                continue;
            }
    
            const color = palette[colorIndex];
            data[pixelI] = color.r;
            data[pixelI + 1] = color.g;
            data[pixelI + 2] = color.b;
            data[pixelI + 3] = 255;
          }
        }

        return imageData;
    }

    renderStampDataUrl(stamp: Stamp, palette: Color[]){
        const canvas = document.createElement('canvas'),
              ctx    = canvas.getContext('2d');

        const imageData = this.renderStampImageData(ctx, stamp, palette);
        canvas.setAttribute('width', '' + imageData.width);
        canvas.setAttribute('height', '' + imageData.height);

        ctx.putImageData(imageData, 0, 0);

        return canvas.toDataURL("image/png");
    }

    renderStampImageData(ctx: any, stamp: Stamp, palette: Color[]){
        const w = stamp.width  * 8,
              h = stamp.height * 8;
        
        const imageData = ctx.createImageData(w, h),
              data = imageData.data;

        for(let x = w - 1; x >= 0; --x){
            for(let y = h - 1; y >= 0; --y){
                const pixelI = (x + y * w) * 4;
        
                let colorIndex = stamp.getTexel(x, y);
                if(colorIndex === 0){
                    data[pixelI] = 0;
                    data[pixelI + 1] = 0;
                    data[pixelI + 2] = 0;
                    data[pixelI + 3] = 0;
                    continue;
                }
        
                const color = palette[colorIndex];
                data[pixelI] = color.r;
                data[pixelI + 1] = color.g;
                data[pixelI + 2] = color.b;
                data[pixelI + 3] = 255;
            }
        }

        return imageData;
    }
}