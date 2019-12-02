import { FormattingUtils } from 'src/utils/formatting-utils';

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
        let code = `    dc.l ${FormattingUtils.padWord(this.positionY)}${FormattingUtils.padWord(this.positionX)}           ; position YYXX\r\n`    + 
                   `    dc.w ${FormattingUtils.padByte(this.type)}${FormattingUtils.padByte(this.state)}                    ; type/state TTSS\r\n`
    }
}