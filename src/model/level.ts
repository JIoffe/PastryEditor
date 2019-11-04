import { FormattingUtils } from 'src/utils/formatting-utils';

const LEVEL_SEPARATOR = '**************************************************\r\n';

export class Level{
    constructor(name, w, h){
        this.name = name;
        this.width = w;
        this.height = h;

        this.tiles = new Int32Array(w * h);
        this.tiles.fill(-1);

        this.mode = 'level';

        this.playerStart = new Int32Array(2);
    }

    name: string;
    width: number;
    height: number;
    tiles: Int32Array;
    playerStart: Int32Array;

    /**
     * Whether this is treated as a pattern or a full level
     */
    mode: string;

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

        if(this.mode === 'level'){
            code += `   dc.l ${this.name}_playerstart\r\n`;
        }
        code += `   dc.l $${FormattingUtils.padWord(this.height)}${FormattingUtils.padWord(this.width)}   \r\n`

        this.tiles.forEach((tile, i) => {
            var tileValue = (tile+0x0001);
            code += `   dc.w $${FormattingUtils.padWord(tileValue)}   \r\n`
        });

        if(this.mode !== 'level')
            return code;

        
        //Add player start position

        code += `${this.name}_playerstart:\r\n`;
        code += `   dc.l $${FormattingUtils.padWord(this.playerStart[1] * 8)}${FormattingUtils.padWord(this.playerStart[0] * 8)}   \r\n`

        return code;
    }

    static manyToCode(levels: Level[]){
        return levels.map(level => level.toCode())
            .reduce((p,c) => p + c + LEVEL_SEPARATOR, '');
    }

    static manyFromCode(code: string){
        return code.split(/\*+[\r\n]*/g).filter(l => !!l.length).map(c => this.fromCode(c));
    }

    static fromCode(code: string){
        if(code == null || !code.length)
            return null;

        let lines = code.split(/[\r\n]+/g).filter(l => !!l.length);
        if(lines.length < 3)
            return null;

        const name = lines[0].replace(/:*/g, '');
        console.log(name);

        let i = 1;

        //Skip over any pointers to level data
        if(lines[i].indexOf('playerstart') >= 0){

        }

        const size = lines[i].match(/[a-f0-9]{8}\s*$/gi)[0].trim();
        const width = parseInt(size.substr(4), 16),
              height = parseInt(size.substr(0, 4), 16);

        const level = new Level(name, width, height);
        i++;
        for(let j = 0; j < level.tiles.length; ++j){
            const line = lines[i].trim();
            if(!line.length)
                continue;

            level.tiles[j] = parseInt(line.match(/[a-f0-9]{4}\s*$/gi)[0], 16)-1;

            ++i;
        }

        if(i >= lines.length){
            level.mode = 'pattern';
            return level;
        }

        level.mode = 'level';
        
        //Expect certain things to be here...
        i++;
        const playerPos = lines[i++].match(/[a-f0-9]{8}\s*$/gi)[0].trim();
        level.playerStart[0] = parseInt(playerPos.substr(4), 16) / 8;
        level.playerStart[1] = parseInt(playerPos.substr(0, 4), 16) / 8;


        return level;
    }
}