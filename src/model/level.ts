export class Level{
    constructor(name, w, h){
        this.name = name;
        this.width = w;
        this.height = h;

        this.tiles = new Int32Array(w * h);
        this.tiles.fill(-1);

        this.palettes = new Uint32Array(w * h);
    }

    name: string;
    width: number;
    height: number;
    tiles: Int32Array;
    palettes: Uint32Array;

    toCode(){

    }
}