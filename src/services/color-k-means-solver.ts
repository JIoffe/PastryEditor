import { Color } from 'src/model/color';
import { Injectable } from '@angular/core';

/**
 * Determines the K Means for a set of colors
 */
@Injectable({
    providedIn: 'root',
})
export class ColorKMeansSolver{
    SolveKMeans(colors: Color[], k: number, iterations = 100){
        return new Promise<Color[]>((resolve, reject) => {
            const worker = new Worker('../app/color-k-means.worker', { name: 'color-k-means', type: 'module' });

            worker.onmessage = ({ data }) => {
                worker.terminate();
                resolve(Array.from(data).map((o:any) => new Color(o.r, o.g, o.b)));
            };

            worker.postMessage({colors, k, iterations});           
        });
    }
}

