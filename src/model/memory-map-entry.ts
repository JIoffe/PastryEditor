export class MemoryMapEntry{
    public label: string;
    public address: number;
    public description: string;
    public isArray: boolean = false;

    public arrayElementSize: number = 0;
    public arrayLength: number = 0;

    private _size: number;
    get size(){
        if(this.isArray){
            return this.arrayElementSize * this.arrayLength;
        }

        return this._size;
    }

    set size(value: number){
        this._size = value;
    }
}