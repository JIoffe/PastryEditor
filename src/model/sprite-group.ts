import { Stamp } from './stamp';
import { Sprite } from './sprite';

/**
 * Represents a rectangular set of sprites for larger images
 */
export class SpriteGroup extends Stamp{
    sprites: Sprite[];
    grid: Sprite[];

    constructor(w: number, h: number){ 
        super();

        this.width = w;
        this.height = h;
        this.grid = new Array(w * h);
        this.sprites = [];

        for(let y = 0; y < h; ++y){
            for(let x = 0; x < w; ++x){
                const i = x + y * w;
                if(!!this.grid[i])
                    continue;

                const spriteWidth = Math.min(w - x, 4);
                const spriteHeight = Math.min(h - y, 4);

                const sprite = new Sprite(spriteWidth, spriteHeight);
                for(let x1 = 0; x1 < spriteWidth; ++x1){
                    for(let y1 = 0; y1 < spriteHeight; ++y1){
                        const i1 = (x + x1) + (y + y1) * w;
                        this.grid[i1] = sprite;
                    }
                }

                this.sprites.push(sprite);
            }
        }

        this.tiles = this.sprites.reduce((p,c) => p.concat(c.tiles), []);
    }
    /**
     * Returns the tile that was updated for the given coordinates
     * @param x texel X coordinate, across entire width of stamp
     * @param y texel Y coordinate, across entire height of stamp
     * @param index
     */
    setTexel(x: number, y: number, index: number): Uint8Array{
        const sprite = this.grid[Math.floor(x/8) + Math.floor(y/8)*this.width];

        for(let x1 = 0; x1 < this.width; ++x1){
            for(let y1 = 0; y1 < this.width; ++y1){
                const i = x1 + y1 * this.width;
                if(this.grid[i] === sprite){
                    return sprite.setTexel(x - x1*8, y - y1*8, index);
                }
            }
        }

        return null;
    }

    /**
     * Returns the palette index at the given texel
     * @param x texel X coordinate, across entire width of stamp
     * @param y texel Y coordinate, across entire height of stamp
     */
    getTexel(x: number, y: number){
        const sprite = this.grid[Math.floor(x/8) + Math.floor(y/8)*this.width];

        for(let x1 = 0; x1 < this.width; ++x1){
            for(let y1 = 0; y1 < this.width; ++y1){
                const i = x1 + y1 * this.width;
                if(this.grid[i] === sprite){
                    return sprite.getTexel(x - x1*8, y - y1*8);
                }
            }
        }

        return 0;
    }

    getTilePos(tileIndex){
        const tile = this.tiles[tileIndex];
        const sprite = this.sprites.find(s => s.tiles.indexOf(tile) >= 0);
        if(!sprite)
            return [0,0];

        const pos = sprite.getTilePos(sprite.tiles.indexOf(tile));

        for(let x = 0; x < this.width; ++x){
            for(let y = 0; y < this.width; ++y){
                const i = x + y * this.width;
                if(this.grid[i] === sprite){
                    pos[0] += x * 8;
                    pos[1] += y * 8;
                    return pos;
                }
            }
        }

        return pos;
    }
}