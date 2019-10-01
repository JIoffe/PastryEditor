import { FormattingUtils } from 'src/utils/formatting-utils';

export class Level{
    constructor(name, w, h){
        this.name = name;
        this.width = w;
        this.height = h;

        this.tiles = new Int32Array(w * h);
        this.tiles.fill(-1);
    }

    name: string;
    width: number;
    height: number;
    tiles: Int32Array;

    toCode(){
        //Label is name
        //One byte for HH, one byte for WW
        //For each tile:
        //WORD for index, palette, and h/v flip
        let code = `${this.name}:\r\n`;
        code += `   dc.w $${FormattingUtils.padByte(this.height)}${FormattingUtils.padByte(this.width)}   \r\n`

        this.tiles.forEach((tile, i) => {
            var tileValue = (tile+0x0001);
            code += `   dc.w $${FormattingUtils.padWord(tileValue)}   \r\n`
        });
        return code;
    }
}