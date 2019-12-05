import { FormattingUtils } from 'src/utils/formatting-utils';
import { ItemTypes, ItemDimensions } from 'src/assets/item-definitions/baolongtu-items';
import { Level } from './level';

export class Item{
    constructor(type: number){
        this.positionX = 0;
        this.positionY = 0;
        this.type = type;
        this.state = 0;
        this.width = 0;
        this.height = 0;
    }

    /**
     * WORD
     */
    positionX: number;
    /**
     * WORD
     */
    positionY: number;
    /**
     * Byte for type
     */
    type: number;
    /**
     * Byte for state
     */
    state: number;

    width: number;
    height: number;

    toCode(){
        return      `* Item: ${Object.keys(ItemTypes).find(k => ItemTypes[k] === this.type)}\r\n` +
                    `    dc.w ${FormattingUtils.padByte(this.type)}${FormattingUtils.padByte(this.state)}                    ; type/state TTSS\r\n`  +
                    `    dc.l ${FormattingUtils.padWord(this.positionY)}${FormattingUtils.padWord(this.positionX)}           ; position YYXX\r\n`;
    }

    computeExtents(level: Level){
        switch(this.type){
            case ItemTypes.MogurenEnemy:
                return [this.positionX, this.positionX + ItemDimensions.MogurenWidth];
            case ItemTypes.GemHorizontal:
                {
                    return [0,0];
                }
            default:
                return [this.positionX, this.positionX];
        }
    }
}