export namespace FormattingUtils{
    export function padLeft(value: string, padding: string, length: number){
        while(value.length < length){
            value = padding + value;
        }

        return value;
    }

    export function padWord(value: number){
        let v = value.toString(16).toUpperCase();
        return padLeft(v, '0', 4);
    }

    export function padByte(value: number){
        let v = value.toString(16).toUpperCase();
        return padLeft(v, '0', 2);
    }

    export function padLong(value: number){
        let v = value.toString(16).toUpperCase();
        return padLeft(v, '0', 8);
    }
}