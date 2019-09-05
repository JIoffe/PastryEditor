import { Stamp } from './stamp';

//Sprites are specical because they are drawn on the MD
//COLUMN first, which is reverse of how I've usually been
//doing "stamps"...
export class Sprite extends Stamp{
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
        return sortedTiles;
    }
}