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
        //Start with a bunch of random centroids
        const maxR = colors.reduce((p, c) => Math.max(p, c.r), 0),
            maxG = colors.reduce((p, c) => Math.max(p, c.g), 0),
            maxB = colors.reduce((p, c) => Math.max(p, c.b), 0);

        let centroids: Centroid<Color>[] = new Array(k);

        for(let i = 0; i < k; ++i){
            let root = new Color(Math.floor(Math.random() * maxR), Math.floor(Math.random() * maxG), Math.floor(Math.random() * maxB));
            centroids[i] = new Centroid(root);
        }

        for(let i = 0; i < iterations; ++i){
            //Add colors to nearest centroid
            colors.forEach(color => {
                let nearestCentroid;
                let nearestD = Number.MAX_SAFE_INTEGER;
                for(let j = 0; j < k; ++j){
                    const d = centroids[j].root.squaredDistance(color.r, color.g, color.b);
                    if(d < nearestD){
                        nearestD = d;
                        nearestCentroid = centroids[j];
                    }
                }

                nearestCentroid.children.push(color);
            });

            //Calculate new centroids from average
            centroids = centroids
                .filter(centroid => !!centroid.children.length)
                .map(centroid => {
                    let average = centroid.children.reduce((p, c) => {
                        p.r += c.r;
                        p.g += c.g;
                        p.b += c.b;
                        return p;
                    }, new Color(0,0,0));

                    average.r /= centroid.children.length;
                    average.g /= centroid.children.length;
                    average.b /= centroid.children.length;

                    return new Centroid(average);
                });

            //It is possible some centroids were rejected
            while(centroids.length < k){
                let root = new Color(Math.floor(Math.random() * maxR), Math.floor(Math.random() * maxG), Math.floor(Math.random() * maxB));
                centroids.push(new Centroid(root));
            }
        }

        return centroids.map(c => c.root);
    }
}

class Centroid<T>{
    root: T;
    children: T[];

    constructor(root: T){
        this.root = root;
        this.children = [];
    }
}