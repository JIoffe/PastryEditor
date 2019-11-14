import { SpriteAnimation } from './sprite-animation';
import { FormattingUtils } from 'src/utils/formatting-utils';
import { ApplicationState } from 'src/services/application-state';
import { calcFrameWidth } from './sprite-frame';

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

    static fromCode(code: string): CompiledSprite{
        return null;
    }

    getExtents(){
        return [200,200];
    }

    toCode(applicationState?: ApplicationState): string{
        /*
            Structure of file:
            * Compression: NONE
            * Embedded: Y
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
        code += '* Embedded: TRUE\r\n';

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
                    const tileDataSize = (f.sprites.map(s => s.tiles.length).reduce((p,c) => p + c, 0) * 8) - 1;
                    code += `    dc.w $${FormattingUtils.padWord(tileDataSize)}           ; (total tiles in frame * 8) - 1\r\n`;

                    f.sprites.forEach(s => {
                        for(let x = 0; x < s.width; ++x){
                            for(let y = 0; y < s.height; ++y){
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

                f.sprites.forEach((s, k) => {                 
                    code += `        dc.w $${FormattingUtils.padByte(s.offsetY)}           ; Offset Vertical\r\n`;
                    code += `        dc.w $${FormattingUtils.padByte(s.getMDSize())}00     ; sprite Size\r\n`;

                    let index: number = -1;
                    if(!!applicationState){
                        index = applicationState.tiles.indexOf(s.tiles[0]);
                    }

                    if(index === -1){
                        index = 0;
                        for(let l = 0; l < k; ++l){
                            index += f.sprites[l].tiles.length;
                        }
                    }

                    code += `        dc.w $${FormattingUtils.padWord(index)}           ; sprite tile ID\r\n`;

                    //Encode separate offsets for flipped and non-flipped varieties
                    const flippedOffsetX = framePixelWidth - (s.offsetX + (s.width * 8));
                    code += `        dc.w $${FormattingUtils.padByte(flippedOffsetX)}${FormattingUtils.padByte(s.offsetX)}           ; Offset Horizontal\r\n`;
                });
            });
        });

        return code;
    }
}