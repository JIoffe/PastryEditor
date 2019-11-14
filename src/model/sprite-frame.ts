import { PositionedSprite } from './positioned-sprite';

export interface SpriteFrame{
    sprites: PositionedSprite[]
}

export function calcFrameWidth(frame: SpriteFrame){
    let w = 0;
  
    frame.sprites.forEach(s => {
        w = Math.max(w, s.offsetX + (s.width * 8));
    });

    return w;
}