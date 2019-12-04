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
        for(let i = n - 1; i >= 0; --i){
          this.tiles[i] = new Uint8Array(64);
        }
    }

    static fromSizeCode(sizeCode: number){
        if(!(sizeCode & 0x00FF)){
            sizeCode = sizeCode >> 8;
        }

        var height = (sizeCode & 3) + 1;
        var width = ((sizeCode - (height - 1)) / 4) + 1

        return new Sprite(width, height);
    }

    setTexel(x: number, y: number, index: number){
        const tile = this.getTile(x, y);
        tile[(x & 7) + ((y & 7) << 3)] = index;

        return tile;
    }

    getTexel(x: number, y: number){
        if(x < 0 || x >= this.width * 8 || y < 0 || y >= this.height * 8)
            return -1;

        const tile = this.getTile(x, y);
        return tile[(x & 7) + ((y & 7) << 3)];
    }

    getMDSize(){
        return (((this.width-1)*4)+this.height-1);
    }

    private getTile(x: number, y: number){
        const x1 = Math.floor(x >> 3),
              y1 = Math.floor(y >> 3);

        const tile = this.tiles[x1 * this.height + y1];
        return tile;
    }
    private resortTiles(){
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