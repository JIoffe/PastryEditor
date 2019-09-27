import { Color } from "src/model/color";

/// <reference lib="webworker" />

addEventListener('message', ({ data }) => {
  const nPixels = data.width * data.height,
        len     = nPixels * 4,
        palette = data.palette.slice(1),
        srcPixels = data.pixels,
        targetPixels = new Uint8ClampedArray(len);

  targetPixels.fill(0);

  for(let y = 0; y < data.height; ++y){
    for(let x = 0; x < data.width; ++x){
      const i = x + y * data.width,
            pixelI = i*4;

      const srcR = srcPixels[pixelI],
            srcG = srcPixels[pixelI + 1],
            srcB = srcPixels[pixelI + 2];

      switch(data.dithering){
        case 'floyd-steinberg':
          {
              /*
                    x   7
                3   5   1
                
                  (1/16)
              */
            let r = targetPixels[pixelI] + srcR,
                g = targetPixels[pixelI + 1] + srcG,
                b = targetPixels[pixelI + 2] + srcB;
    
            let colorMatch = Color.getNearestColor(palette, r, g, b);
    
            let errorR = (r - colorMatch.r) >> 4,
                errorG = (g - colorMatch.g) >> 4,
                errorB = (b - colorMatch.b) >> 4;
    
                targetPixels[pixelI] = colorMatch.r;
                targetPixels[pixelI + 1] = colorMatch.g;
                targetPixels[pixelI + 2] = colorMatch.b;
                targetPixels[pixelI + 3] = 255;
    
            // //Apply error to neighboring pixels
            let neighbor;
            if(x > 0 && y < data.height - 1){
              neighbor = (i + data.width * 4) - 4;
              targetPixels[neighbor] += errorR * 3;
              targetPixels[neighbor + 1] += errorG * 3;
              targetPixels[neighbor + 2] += errorB * 3;
            }
    
            if(x < data.width - 1){
              neighbor = pixelI + 4;
              targetPixels[neighbor] += errorR * 7;
              targetPixels[neighbor + 1] += errorG * 7;
              targetPixels[neighbor + 2] += errorB * 7;
            }
    
            if( y < data.height - 1){
              neighbor = pixelI + data.width * 4;
              targetPixels[neighbor] += errorR * 5;
              targetPixels[neighbor + 1] += errorG * 5;
              targetPixels[neighbor + 2] += errorB * 5;
            }
    
            if(y < data.height - 1 && x < data.width - 1){
              neighbor = pixelI + 4 + data.width * 4;
              targetPixels[neighbor] += errorR;
              targetPixels[neighbor + 1] += errorG;
              targetPixels[neighbor + 2] += errorB;
            }
          }
          break;
        default:
          {
            let colorMatch = Color.getNearestColor(palette, srcR, srcG, srcB);
    
            targetPixels[pixelI] = colorMatch.r;
            targetPixels[pixelI + 1] = colorMatch.g;
            targetPixels[pixelI + 2] = colorMatch.b;
            targetPixels[pixelI + 3] = 255;
          }
          break;
      }
    }
  }

  //@ts-ignore
  postMessage(targetPixels, [targetPixels.buffer]);
});