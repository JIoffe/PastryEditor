import { Stamp } from './stamp';

//Sprites are specical because they are drawn on the MD
//COLUMN first, which is reverse of how I've usually been
//doing "stamps"...
export class Sprite extends Stamp{
    constructor(w: number, h: number){
        super();

        this.width = w;
        this.height = h;

        const n = w * h;

        this.tiles = new Array(n);
        for(let i = n - 1; i >= 0; --i)
          this.tiles[i] = new Uint8Array(64);
    }

    getMDSize(){
        return (((this.width-1)*4)+this.height-1);
    }

    /**
     * Sorts tile refs so they are COLUMN major
     */
    resortTiles(){
        const w = this.width,
              h = this.height;
        const sortedTiles = new Array(this.tiles.length);
         
        for(let dstI = 0; dstI < this.tiles.length; ++dstI){
          const srcI = (dstI % w) * h + Math.floor(dstI/w);
          sortedTiles[dstI] = this.tiles[srcI];
        }
        
        this.tiles = sortedTiles;
    }
}