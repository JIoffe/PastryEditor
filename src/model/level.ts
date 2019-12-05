import { FormattingUtils } from 'src/utils/formatting-utils';
import { Enemy } from './enemy';
import { Item } from './item';
import { ItemTypes } from 'src/assets/item-definitions/baolongtu-items';

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

        this.items = [];
    }

    name: string;
    width: number;
    height: number;
    tiles: Int32Array;
    playerStart: Int32Array;

    /**
     * Items includes enemies and collectibles
     */
    items: Item[];

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
            code += `   dc.l ${this.name}_items\r\n`;
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

        //Add items
        code += `${this.name}_items:\r\n`;
        code += `   dc.w $${FormattingUtils.padWord(this.items.length)}   \r\n`

        //Here is an idea to sort everything in a presorted list by x position....
        // code += `   dc.w $${FormattingUtils.padWord(this.tiles.length - 1)}   ; items length - 1\r\n`
        // code += this.items
        //     .sort((a, b) => a.positionX - b.positionX)
        //     .map(item => item.toCode())
        //     .reduce((p, c) => p + c, '');

        //Instead, use statically defined "bins" or slices of the level
        //that hold objects in a static list. 
        //Item locations are PREDETERMINED by their maximum range.
        //eg. mushrooms can walk back and forth

        //Divide the level into slices of 40 tiles wide.
        //Only ever consider two slices at a time.
        const slices: number[][] = new Array(Math.ceil(this.width / 40)).fill([]);

        this.items.forEach((item, i) => {
            code += item.toCode();

            //Decide where this goes....
            const extents = item.computeExtents(this);
            const start = extents[0] >> 3,
                  end = extents[1] >> 3;

            for(let j = start; j <= end; ++j){
                slices[i].push(i);
            }
        });
        code += `${this.name}_items_slices:\r\n`;
        slices.forEach((s, i) => {
            code += `   dc.l ${this.name}_items_slices${i}   \r\n`
        });
        slices.forEach((s, i) => {
            code += `${this.name}_items_slices${i}:   \r\n`
            code += `   dc.w $${FormattingUtils.padWord(s.length)}   ; number of items in slice\r\n`
            s.forEach(itemRef => {
                code += `   dc.w $${itemRef}   \r\n`
            });
        });
            
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

        let i = 1;

        //Skip over any pointers to level data
        if(lines[i].indexOf('playerstart') >= 0){
            ++i;
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