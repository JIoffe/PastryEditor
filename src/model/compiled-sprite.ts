import { SpriteAnimation } from './sprite-animation';

/**
 * Represents an entire asset with collision information, multiple sprites, tile data, and animations
 */
export class CompiledSprite{
    constructor(){
        this.name = 'Unnamed';
        this.animations = [];
    }

    name: string;
    animations: SpriteAnimation[];

    getExtents(){
        return [200,200];
    }
}


// {
//     name: 'Rabbit',
//     tileallocation: 2,

// }