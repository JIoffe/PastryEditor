import { ApplicationState } from "./application-state";
import { ColorKMeansSolver } from './color-k-means-solver';
import { Injectable } from '@angular/core';
import { Color } from 'src/model/color';

@Injectable({
    providedIn: 'root',
})
export class ImageQuantizer{
    constructor(private applicationState: ApplicationState, private colorKMeansSolver: ColorKMeansSolver) { }

    quantizeImage(pixels: Uint8ClampedArray, palette: Color[], width: number, height: number, dithering: string): Promise<ImageData>{
        return new Promise<ImageData>((res, reject) => {
            const worker = new Worker('../app/imageproc.worker', { type: 'module' });

            worker.onmessage = ({ data }) => {
                worker.terminate();
                res(data);
            };

            worker.postMessage({
                pixels: pixels,
                palette: palette,
                width: width,
                height: height,
                dithering: dithering
            });           
        });
    }
}