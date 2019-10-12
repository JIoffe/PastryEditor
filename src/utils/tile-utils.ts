export namespace TileUtils{
    export function tileCmp(a: Uint8Array, b: Uint8Array){
        for(let i = 63; i >= 0; --i){
            if(a[i] !== b[i])
                return false;
        }

        return true;
    }
}