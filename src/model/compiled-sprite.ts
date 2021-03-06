import { SpriteAnimation } from './sprite-animation';
import { FormattingUtils } from 'src/utils/formatting-utils';
import { ApplicationState } from 'src/services/application-state';
import { calcFrameWidth, SpriteFrame } from './sprite-frame';
import { Sprite } from './sprite';
import { PositionedSprite } from './positioned-sprite';

const SPRITE_SEPARATOR = '**************************************************\r\n';

/**
 * Represents an entire asset with collision information, multiple sprites, tile data, and animations
 */
export class CompiledSprite{
    constructor(){
        this.name = 'Unnamed';
        this.animations = [];
        this.embedded = true;
    }

    embedded: boolean;
    name: string;
    animations: SpriteAnimation[];

    /**
     * Returns a complete set of all tiles from all animations in this sprite collection
     */
    get completeTileset(){
        return this.completeSpriteSet
            .map(s => s.tiles)
            .reduce((p, c) => p.concat(c), []);
    }

    /**
     * Returns a complete set of all subsprites in this sprite collection
     */
    get completeSpriteSet(){
        return this.animations
            .map(a => a.frames)
            .reduce((p,c) => p.concat(c), [])
            .map(f => f.sprites)
            .reduce((p, c) => p.concat(c), [])
    }

    static manyToCode(compiledSprites: CompiledSprite[], applicationState? :ApplicationState){
        return compiledSprites.map(s => s.toCode(applicationState))
            .reduce((p,c) => p + c + SPRITE_SEPARATOR, '');
    }

    static manyFromCode(code: string, applicationState?: ApplicationState){
        return code.split(/\*+[\r\n$]/g).filter(l => !!l.length).map(c => CompiledSprite.fromCode(c, applicationState));
    }

    static fromCode(code: string, applicationState?: ApplicationState): CompiledSprite{
        if(!code || !code.length)
            return null;

        const compiledSprite = new CompiledSprite();
        const lines = code.match(/[^\r\n]+/g);
        
        compiledSprite.embedded = !!lines.find(l => !!l.match(/embedded\s*:\s*(Y)|(true)/gi));

        let i = lines.findIndex(l => l[0] != '*');      //data starts here
        compiledSprite.name = lines[i++].replace(/:/g, '');

        while(i < lines.length){
            let animation: SpriteAnimation = {
                name: lines[i++].replace(/:/g, '').replace(`${compiledSprite.name}_`, '').trim(),
                frames: []
            };
            
            
            const nFrames = parseInt(lines[i++].match(/[0-9a-fA-F]{4}/g)[0], 16) + 1;
            //skip over for the number of frames (array of pointers)
            i += nFrames;

            for(let j = 0; j < nFrames; ++j){
                i++;    //skip over frame label

                let tiles: Uint8Array[];

                if(compiledSprite.embedded){
                    //Get tiles
                    const nTiles = (parseInt(lines[i++].match(/[0-9a-fA-F]{4}/g)[0], 16) >> 4);
                    tiles = new Array(nTiles);
                    for(let k = 0; k < nTiles; ++k){
                        let tileData = lines[i++].match(/[0-9a-fA-F]{8}/g)
                            .reduce((p,c) => p.concat(c), [])
                            .reduce((p,c) => p + c, '')
                            .split('')
                            .map(c => parseInt(c, 16));

                        let tile = new Uint8Array(tileData);
                        tiles[k] = tile;
                    }
                }else{
                    tiles = applicationState.tiles;
                }
                    
                var frame: SpriteFrame = {
                    sprites: []
                }

                const nSprites = parseInt(lines[i++].match(/[0-9a-fA-F]{4}/g)[0], 16) + 1;
                for(let k = 0; k < nSprites; ++k){
                    //This would not account yet for a "flipped y" offset (maybe future state)
                    const encodedYOffset = lines[i++].match(/\$[0-9a-fA-F]{2,4}/g)[0],
                          offsetY =   FormattingUtils.getSignedByte(encodedYOffset.substr(1));

                    const sizeCode = parseInt(lines[i++].match(/\$[0-9a-fA-F]{2,4}/g)[0].substr(1), 16);
                    let tileId = parseInt(lines[i++].match(/\$[0-9a-fA-F]{2,4}/g)[0].substr(1), 16);

                    if(!compiledSprite.embedded){
                        tileId -= 1;
                    }

                    const encodedOffset = lines[i++].match(/\$[0-9a-fA-F]{4}/g)[0];
                    const offsetX = FormattingUtils.getSignedByte(encodedOffset.substr(3)),
                          flippedOffsetX = FormattingUtils.getSignedByte(encodedOffset.substr(1,2));
;
                    const sprite = PositionedSprite.fromSizeCode(sizeCode);
                    sprite.offsetX = offsetX;
                    sprite.flippedOffsetX = flippedOffsetX
                    sprite.offsetY = offsetY;

                    sprite.tiles = tiles.slice(tileId, tileId + (sprite.width * sprite.height));
                    frame.sprites.push(sprite);
                }

                animation.frames.push(frame);
            }

            compiledSprite.animations.push(animation);
        }
        
        return compiledSprite;
    }

    getExtents(){
        return [200,200];
    }

    toCode(applicationState?: ApplicationState): string{
        /*
            Structure of file:
            * Compression: NONE
            * Embedded: Y
            * Tiles to Allocate: #
            Name as label:
                (For Each Animation)
                Animation Name as Label:
                    frame count - 1 (word for padding)
                    (For each frame)
                    Long address of frame start:

                    (For each frame)
                        (IF Embedded):
                        (n tile words) - 1 (word)
                        tile , 8xLONG per tile

                        word n sprites-1 (for padding)
                        (for each sprite)
                        Offset YYXX (word)
                        Size code (word)

                        tile index (WORD) (may need to be offset!)
        */
        let code = '';

        code += '* Compression: NONE\r\n';
        code += `* Embedded: ${this.embedded ? 'TRUE' : 'FALSE'}\r\n`;

        //Output the size of the buffer we would need if streaming tiles on the fly
        const maxTilesInFrame = this.animations
            .map(a => a.frames)
            .reduce((p,c) => p.concat(c), [])
            .map(f => f.sprites.reduce((p,c) => p + c.tiles.length, 0))
            .reduce((p,c) => Math.max(p,c), 0);

        code += `* Tiles to Allocate: ${maxTilesInFrame}\r\n`;

        code += `${this.name}:\r\n`;
        this.animations.forEach(anim => {
            const animationLabel = `${this.name}_${anim.name}`;

            code += `    ${animationLabel}:\r\n`;
            code += `    dc.w $${FormattingUtils.padWord(anim.frames.length - 1)}           ; frame count\r\n`;
            anim.frames.forEach((f,i) => {
                code += `    dc.l ${this.name}_${anim.name}${i}\r\n`;
            });

            anim.frames.forEach((f,i) => {
                const framePixelWidth = calcFrameWidth(f);

                code += `    ${this.name}_${anim.name}${i}:\r\n`;

                //Actual tile data for the frame
                if(this.embedded){
                    //To help with DMA, store the total length of the tiles * 16 (the byte size / 2)
                    const tileDataSize = (f.sprites.map(s => s.tiles.length).reduce((p,c) => p + c, 0) << 4);
                    code += `    dc.w $${FormattingUtils.padWord(tileDataSize)}           ; (total byte size of tiles / 2)\r\n`;

                    f.sprites.forEach(s => {
                        for(let y = 0; y < s.height; ++y){
                            for(let x = 0; x < s.width; ++x){
                                const i = x + y * s.width;
                                const tile = s.tiles[i];

                                const indices = Array.from(tile).map(n => n.toString(16).toUpperCase());
                                let line = `$${indices.slice(0, 8).reduce((p,c) => p + c, '')}`;
        
                                for(let j = 8; j < 64; j += 8){
                                    line += `, $${indices.slice(j, j + 8).reduce((p,c) => p + c, '')}`;
                                }
                                code += `        dc.l ${line}\r\n`;
                            }
                        }
                    });
                }

                code += `        dc.w $${FormattingUtils.padWord(f.sprites.length - 1)}\r\n`;

                //In the future could encode the "flipped y" offset here in the byte as well
                f.sprites.forEach((s, k) => {                 
                    code += `        dc.w $00${FormattingUtils.padByte(s.offsetY)}           ; Offset Vertical\r\n`;
                    code += `        dc.w $${FormattingUtils.padByte(s.getMDSize())}00     ; sprite Size\r\n`;

                    let index: number = -1;
                    if(!!applicationState && !this.embedded){
                        index = applicationState.tiles.indexOf(s.tiles[0]) + 1;
                    }

                    if(index === -1){
                        index = 0;
                        for(let l = 0; l < k; ++l){
                            index += f.sprites[l].tiles.length;
                        }
                    }

                    code += `        dc.w $${FormattingUtils.padWord(index)}           ; sprite tile ID\r\n`;

                    //Encode separate offsets for flipped and non-flipped varieties
                    code += `        dc.w $${FormattingUtils.padByte(s.flippedOffsetX)}${FormattingUtils.padByte(s.offsetX)}           ; Offset Horizontal\r\n`;
                });
            });
        });

        return code;
    }
}