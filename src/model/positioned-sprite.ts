import { Sprite } from './sprite';

export class PositionedSprite extends Sprite{
    offsetX: number;
    offsetY: number;

    flippedOffsetX: number;

    static fromSizeCode(sizeCode: number){
        if(!(sizeCode & 0x00FF)){
            sizeCode = sizeCode >> 8;
        }

        var height = (sizeCode & 3) + 1;
        var width = ((sizeCode - (height - 1)) / 4) + 1

        return new PositionedSprite(width, height);
    }
}