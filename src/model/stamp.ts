import { Color } from './color';

export class Stamp{
    //Stamp is laid horizontally first
    tiles: Uint8Array[];
    width: number;
    height: number;
    palette: Color[];
    name: string;

    /**
     * Returns the tile that was updated for the given coordinates
     * @param x texel X coordinate, across entire width of stamp
     * @param y texel Y coordinate, across entire height of stamp
     * @param index
     */
    setTexel(x: number, y: number, index: number): Uint8Array{
        const tileX = Math.floor(x / 8),
              tileY = Math.floor(y / 8);

        const tile = this.tiles[tileX + tileY * this.width];

        const texel = (x % 8) + (y % 8) * 8;
        tile[texel] = index;
        return tile;
    }

    /**
     * Returns the palette index at the given texel
     * @param x texel X coordinate, across entire width of stamp
     * @param y texel Y coordinate, across entire height of stamp
     */
    getTexel(x: number, y: number){
        const tileX = Math.floor(x / 8),
              tileY = Math.floor(y / 8);

        const tile = this.tiles[tileX + tileY * this.width];

        const texel = (x % 8) + (y % 8) * 8;
        return tile[texel];
    }

    getTilePos(tileIndex){
        const x = (tileIndex % this.width) * 8,
              y = Math.floor(tileIndex / this.width) * 8;

        return [x,y]
    }

    gridTemplateRows(){
        let prop = '';
        for(let i = this.height - 1; i >= 0; --i){
          prop += ' 1fr';
        }
    
        return prop;
      }
    
    
    gridTemplateColumns(){
    let prop = '';
    for(let i = this.width - 1; i >= 0; --i){
        prop += ' 1fr';
    }

    return prop;
    }
}