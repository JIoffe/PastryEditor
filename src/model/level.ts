import { FormattingUtils } from 'src/utils/formatting-utils';

export class Level{
    constructor(name, w, h){
        this.name = name;
        this.width = w;
        this.height = h;

        this.tiles = new Int32Array(w * h);
        this.tiles.fill(-1);

        this.palettes = new Uint32Array(w * h);
    }

    name: string;
    width: number;
    height: number;
    tiles: Int32Array;
    palettes: Uint32Array;

    toCode(){
        //Label is name
        //One byte for HH, one byte for WW
        //For each tile:
        //WORD for index, palette, and h/v flip
        let code = `${this.name}:\r\n`;
        code += `   dc.w $${FormattingUtils.padByte(this.height)}${FormattingUtils.padByte(this.width)}   \r\n`

        const paletteMask = i => {
            switch(i){
                case 0:
                    return 0;
                case 1:
                    return 0x2000;
                case 2:
                    return 0x4000;
                case 4:
                    return 0x6000;
            }
        }
        this.tiles.forEach((tile, i) => {
            var tileValue = (tile+1)|paletteMask(this.palettes[i]);
            code += `   dc.w $${FormattingUtils.padWord(tileValue)}   \r\n`
        });
        return code;
    }
}