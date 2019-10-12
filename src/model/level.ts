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

    copy(src: Level){
        this.name = src.name;
        this.width = src.width;
        this.height = src.height;
        this.tiles = src.tiles;
    }

    toCode(){
        //Label is name
        //One byte for HH, one byte for WW
        //For each tile:
        //WORD for index, palette, and h/v flip
        let code = `${this.name}:\r\n`;
        code += `   dc.l $${FormattingUtils.padWord(this.height)}${FormattingUtils.padWord(this.width)}   \r\n`

        this.tiles.forEach((tile, i) => {
            var tileValue = (tile+0x0001);
            code += `   dc.w $${FormattingUtils.padWord(tileValue)}   \r\n`
        });
        return code;
    }

    static fromCode(code: string){
        if(code == null || !code.length)
            return null;

        let lines = code.split(/[\r\n]+/g);
        if(lines.length < 3)
            return null;

        const name = lines[0].replace(/:*/, '');

        const size = lines[1].match(/[a-f0-9]{8}\s*$/gi)[0].trim();
        const width = parseInt(size.substr(4), 16),
              height = parseInt(size.substr(0, 4), 16);

        const level = new Level(name, width, height);

        for(let i = 2; i < lines.length; ++i){
            const line = lines[i].trim();
            if(!line.length)
                continue;

            level.tiles[i - 2] = parseInt(line.match(/[a-f0-9]{4}\s*$/gi)[0], 16)-1;
        }

        return level;
    }
}