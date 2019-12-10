export namespace FormattingUtils{
    export function padLeft(value: string, padding: string, length: number){
        while(value.length < length){
            value = padding + value;
        }

        return value;
    }

    export function padWord(value: number){
        if(value < 0){
            value = 65536 + value;
        }
        let v = value.toString(16).toUpperCase();
        return padLeft(v, '0', 4);
    }

    export function padByte(value: number){
        if(value < 0){
            value = 256 + value;
        }
        let v = value.toString(16).toUpperCase();
        return padLeft(v, '0', 2);
    }

    export function padLong(value: number){
        if(value < 0){
            value = 4294967296 + value;
        }
        let v = value.toString(16).toUpperCase();
        return padLeft(v, '0', 8);
    }

    export function getSignedByte(value: number|string){
        if(typeof value === 'string')
            value = parseInt(value, 16);

        if(value & 128){
            return value - 256;
        }

        return value;
    }
}