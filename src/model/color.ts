//Reference: http://gendev.spritesmind.net/forum/viewtopic.php?f=22&t=2188
//This is not a linear ramp so values are approximate
const SEGA_MD_COLORRAMP = [0, 52, 87, 116, 144, 172, 206, 255];
const SEGA_MD_CHANNEL_POSSIBILITIES = [0x0, 0x2, 0x4, 0x6, 0x8, 0xA, 0xC, 0xE];

export class Color{
    public r : number;
    public g : number;
    public b : number;

    constructor(r: number, g: number, b: number){
        this.r = r || 0;
        this.b = b || 0;
        this.g = g || 0;
    }

    equals(c: Color){
        return this.r === c.r && this.g === c.g && this.b === c.b;
    }

    toCSS(){
        return `rgb(${this.r}, ${this.g}, ${this.b})`;
    }

    to24Bit(){
        let c = (this.r & 0xFF) << 16;
        c |= (this.g & 0xFF) << 8;
        c |= this.b & 0xFF;

        return c;
    }

    toSegaMDString(){
        let r = SEGA_MD_CHANNEL_POSSIBILITIES[SEGA_MD_COLORRAMP.indexOf(this.clampChannelToSegaMD(this.r))].toString(16).toUpperCase(),
            g = SEGA_MD_CHANNEL_POSSIBILITIES[SEGA_MD_COLORRAMP.indexOf(this.clampChannelToSegaMD(this.g))].toString(16).toUpperCase(),
            b = SEGA_MD_CHANNEL_POSSIBILITIES[SEGA_MD_COLORRAMP.indexOf(this.clampChannelToSegaMD(this.b))].toString(16).toUpperCase();

        return `$0${b}${g}${r}`;
    }

    clampToSegaMD(){
        this.r = this.clampChannelToSegaMD(this.r);
        this.g = this.clampChannelToSegaMD(this.g);
        this.b = this.clampChannelToSegaMD(this.b);
    }

    squaredDistance(r, g, b){
        const dR = this.r - r,
              dG = this.g - g,
              dB = this.b - b;
        
        return dR*dR + dG*dG + dB*dB;
    }

    static squaredDistance(r0, g0, b0, r1, g1, b1){
        const dR = r0 - r1,
            dG = g0 - g1,
            dB = b0 - b1;
  
        return dR*dR + dG*dG + dB*dB;
    }

    /* FACTORIES */
    static fromHexRGB(rgb: number){
        const r = (rgb & 0xFF0000) >> 16;
        const g = (rgb & 0x00FF00) >> 8;
        const b = (rgb & 0x0000FF);

        return new Color(r,g,b);
    }

    static fromHSL(h: number, s: number, l: number){
        let rgb = this.hslToRGB(h,s,l);
        return new Color(rgb[0], rgb[1], rgb[2]);
    }

    static fromColor(src: Color){
        return new Color(src.r, src.g, src.b);
    }

    static fromSegaMDWord(v: number){
        let r = SEGA_MD_COLORRAMP[SEGA_MD_CHANNEL_POSSIBILITIES.indexOf(v & 0x000E)],
            g = SEGA_MD_COLORRAMP[SEGA_MD_CHANNEL_POSSIBILITIES.indexOf((v & 0x00E0) >> 4)],
            b = SEGA_MD_COLORRAMP[SEGA_MD_CHANNEL_POSSIBILITIES.indexOf((v & 0x0E00) >> 8)];

        return new Color(r,g,b);
    }
    /*
        COLOR UTILITIES
    */

    //Reference: https://www.easyrgb.com/en/math.php
    /**
     * 
     * @param {number} hue 0-1 (x / 360 degrees)
     * @param {number} saturation 0-1 (%)
     * @param {number} lightness  0-1 (%)
     */
    static hslToRGB(hue, saturation, lightness){
        if(saturation === 0){
            //Literally achromatic
            let value = lightness * 255;
            return [value,value,value];
        }

        const hueToRGB = ( v1, v2, hue ) =>
        {
            if( hue < 0 ) 
                hue += 1;
            else if( hue > 1 )
                hue -= 1;

            if( ( 6 * hue ) < 1 ) return ( v1 + ( v2 - v1 ) * 6 * hue )
            if( ( 2 * hue ) < 1 ) return ( v2 )
            if( ( 3 * hue ) < 2 ) return ( v1 + ( v2 - v1 ) * ( ( 2 / 3 ) - hue ) * 6 )
            return v1
        }

        let var_2 = lightness < 0.5
            ? lightness * (1.0 + saturation)
            : (lightness + saturation) - (saturation * lightness)

        let var_1 = 2 * lightness - var_2;

        return [
            Math.round(255 * hueToRGB( var_1, var_2, hue + ( 1 / 3 ) )),
            Math.round(255 * hueToRGB( var_1, var_2, hue )),
            Math.round(255 * hueToRGB( var_1, var_2, hue - ( 1 / 3 ) ))
        ];
    }

    static rgbToHSL(r, g, b){
        let h, s, l;

        r /= 255;
        g /= 255;
        b /= 255;

        const minChannel = Math.min(r,g,b);
        const maxChannel = Math.max(r,g,b);
        const channelDelta = maxChannel - minChannel;

        l = (maxChannel + minChannel) / 2.0;

        if(channelDelta === 0){
            h = 0;
            s = 0;
        }else{
            s = l < 0.5
                ? channelDelta / (maxChannel + minChannel)
                : channelDelta / ( 2.0 - maxChannel - minChannel);

            let deltaR = ( ( ( maxChannel - r ) / 6 ) + ( channelDelta / 2 ) ) / channelDelta;
            let deltaG = ( ( ( maxChannel - g ) / 6 ) + ( channelDelta / 2 ) ) / channelDelta;
            let deltaB = ( ( ( maxChannel - b ) / 6 ) + ( channelDelta / 2 ) ) / channelDelta;

            if(r === maxChannel)
                h = deltaB - deltaG;
            else if(g === maxChannel)
                h = (1/3) + deltaR - deltaB;
            else
                h = (2/3) + deltaG - deltaR;

            if(h < 0)
                ++h;
            else if(h > 1)
                --h;
        }

        return [h * 360,s * 100,l * 100]
            .map(x => Math.round(x));
    }

    /**
     * Returns a grayscale ramp clamped to Sega MD approximate values
     */
    static getSegaMDRamp(){
        return SEGA_MD_COLORRAMP.map(v => new Color(v,v,v));
    }

    static getNearestColor(colors: Color[], r, g, b){
        let nearestColor = colors[colors.length - 1];
        let d = !!nearestColor.squaredDistance ? nearestColor.squaredDistance(r,g,b)
            : Color.squaredDistance(nearestColor.r, nearestColor.g, nearestColor.g, r,g,b);

        for(let i = colors.length - 2; i >= 0; --i){
            let color = colors[i];
            let di = !!color.squaredDistance ? color.squaredDistance(r,g,b)
                : Color.squaredDistance(color.r, color.g, color.g, r,g,b);

            if(di < d){
                d = di;
                nearestColor = colors[i];
            }
        }

        return nearestColor;
    }

    //Async
    static getDistinctColors(pixels: Uint8ClampedArray){
        return new Promise((resolve, reject) => {
            resolve('poop');
            // const worker = new Worker('../app/palette-extractor.worker', { type: 'module' });
            // worker.onmessage = ({ data }) => {
            //     worker.terminate();
            //     resolve(data.map(c => new Color(c.r, c.g, c.b)));
            // };

            // worker.postMessage(pixels); 
        });
    }

    static getDistinctColorsFromImageData(imageData: any){
        //There must be a faster approach for this but whatever
        const data = imageData.data;
        var colors = [];


        for(let x = 0; x < imageData.width; ++x){
            for(let y = 0; y < imageData.height; ++y){
                const pixelI = (x + y * imageData.width) * 4;
                const r = data[pixelI],
                      g = data[pixelI + 1],
                      b = data[pixelI + 2];
                      
                if(!colors.find(c => c.r === r && c.g === g && c.b === b)){
                    colors.push(new Color(r,g,b));
                }
            }
        }

        return colors;
    }

    private clampChannelToSegaMD(v){
        for(let i = SEGA_MD_COLORRAMP.length - 1; i > 0; --i){
            const a = SEGA_MD_COLORRAMP[i],
                  b = SEGA_MD_COLORRAMP[i - 1];

            if(v >= a)
                return a;
            
            if(v > b){
                if(Math.abs(a - v) < Math.abs(b - v)){
                    return a;
                }else{
                    return b;
                }
            }
        }

        return 0;
    }
}