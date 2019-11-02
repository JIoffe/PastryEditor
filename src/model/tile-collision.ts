export interface TileCollision{
    isWall: boolean;
    isFloor: boolean;
    isCeiling: boolean;
    heightmap: Uint8Array
}