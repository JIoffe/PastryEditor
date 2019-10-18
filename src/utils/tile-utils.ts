export namespace TileUtils{
    /**
     * Compares two tiles
     * @param a Tile A
     * @param b Tile B
     * @returns -1 if tiles are not similar
     * @returns 0 if tiles are identical
     * @returns 1 if A is B flipped horizontally
     * @returns 2 if A is B flipped vertically
     * @returns 3 if A is B flipped both horizontally and vertically
     */
    export function tileCmpAll(a: Uint8Array, b: Uint8Array){
        if(tileCmp(a, b))
            return 0;
        if(tileCmpHFlip(a, b))
            return 1;

        if(tileCmpVFlip(a, b))
            return 2;

        if(tileCmpHVFlip(a, b))
            return 3;

        return -1;
    }

    /**
     * Compares two tiles
     * @param a Tile A
     * @param b Tile B
     * @returns true if tile indices are identical
     */
    export function tileCmp(a: Uint8Array, b: Uint8Array){
        for(let i = 63; i >= 0; --i){
            if(a[i] !== b[i])
                return false;
        }

        return true;
    }

    export function tileCmpHFlip(a: Uint8Array, b: Uint8Array){
        for(let x = 7; x >= 0; --x){
            for(let y = 7; y >= 0; --y){
                const iA = 7 - x + y * 8,
                      iB = x + y * 8;

                if(a[iA] !== b[iB])
                    return false;
            }
        }
        
        return true;
    }

    export function tileCmpVFlip(a: Uint8Array, b: Uint8Array){
        for(let x = 7; x >= 0; --x){
            for(let y = 7; y >= 0; --y){
                const iA = x + (7 - y) * 8,
                      iB = x + y * 8;

                if(a[iA] !== b[iB])
                    return false;
            }
        }
        
        return true;
    }

    export function tileCmpHVFlip(a: Uint8Array, b: Uint8Array){
        for(let x = 7; x >= 0; --x){
            for(let y = 7; y >= 0; --y){
                const iA = 7 - x + (7 - y) * 8,
                      iB = x + y * 8;

                if(a[iA] !== b[iB])
                    return false;
            }
        }
        
        return true;
    }
}