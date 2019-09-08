import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Color } from 'src/model/color';
import { Stamp } from 'src/model/stamp';
import { TileRenderer } from './tile-renderer';
import { Sprite } from 'src/model/sprite';

@Injectable({
    providedIn: 'root',
})
export class ApplicationState {
    /**A palette was selected */
    PaletteObservable: Subject<Color[]> = new Subject();
    /**The entire set of palettes has been updated */
    PaletteSetObservable: Subject<Color[][]> = new Subject();


    /** A tile was selected */
    TileSelectedObservable: Subject<Uint8Array> = new Subject();
    /**A specific tile's contents was updated */
    TileUpdatedObservable: Subject<Uint8Array> = new Subject();
    /**An entire tile set has been updated and should be refreshed */
    TilesetObservable: Subject<Uint8Array[]> = new Subject();

    /** A stamp was updated */
    StampUpdatedObservable: Subject<Stamp> = new Subject();
    /** Entire set of stamps was updated */
    StampsetUpdatedObservable: Subject<Stamp[]> = new Subject();
    /** A stamp was selected */
    StampSelectedObservable: Subject<Stamp> = new Subject();

    SpriteSetUpdatedObservable: Subject<Sprite[]> = new Subject();
    SpriteSelectedObservable: Subject<Sprite> = new Subject();

    palettes = [
        [0x0000, 0x0000, 0x0EEE, 0x0E00, 0x00E0, 0x000E, 0x00EE, 0x0E0E, 0x0EE0, 0x0222, 0x0444, 0x0666, 0x0888, 0x0AAA, 0x0CCC, 0x0EEE].map(Color.fromSegaMDWord),
        [0x0000, 0x0000, 0x0EEE, 0x0E00, 0x00E0, 0x000E, 0x00EE, 0x0E0E, 0x0EE0, 0x0222, 0x0444, 0x0666, 0x0888, 0x0AAA, 0x0CCC, 0x0EEE].map(Color.fromSegaMDWord),
        [0x0000, 0x0000, 0x0EEE, 0x0E00, 0x00E0, 0x000E, 0x00EE, 0x0E0E, 0x0EE0, 0x0222, 0x0444, 0x0666, 0x0888, 0x0AAA, 0x0CCC, 0x0EEE].map(Color.fromSegaMDWord),
        [0x0000, 0x0000, 0x0EEE, 0x0E00, 0x00E0, 0x000E, 0x00EE, 0x0E0E, 0x0EE0, 0x0222, 0x0444, 0x0666, 0x0888, 0x0AAA, 0x0CCC, 0x0EEE].map(Color.fromSegaMDWord)
      ];
    activePalette = this.palettes[0];
    activeColor = 0;

    tiles: Uint8Array[] = [];
    activeTile = this.tiles[0];
    tileImageData: Map<Uint8Array, string> = new Map();

    stamps: Stamp[] = [];
    activeStamp: Stamp = null;

    sprites: Sprite[] = [];
    activeSprite: Sprite = null;

    traceImage: string = null;

    drawMode: string = 'p';

    constructor(private tileRenderer: TileRenderer){
        //This is a singleton so these watchers do not need to be cleared
        this.TileUpdatedObservable.subscribe(tile => {
          this.tileImageData.set(tile, this.tileRenderer.renderTileDataUrl(tile, this.activePalette));
        });
        this.TileSelectedObservable.subscribe(tile => this.activeTile = tile);
        this.TilesetObservable.subscribe(tiles => {
          this.tiles = tiles;
          this.redrawAllTiles();
        });

        this.PaletteObservable.subscribe(palette => {
          this.activePalette = palette;
          this.redrawAllTiles();
        });

        this.PaletteSetObservable.subscribe(palettes => this.palettes = palettes);

        this.StampSelectedObservable.subscribe(stamp => this.activeStamp = stamp);
        this.StampsetUpdatedObservable.subscribe(stamps => this.stamps = stamps);

        this.SpriteSetUpdatedObservable.subscribe(sprites => this.sprites = sprites);
        this.SpriteSelectedObservable.subscribe(sprite => this.activeSprite = sprite);
    }

    redrawAllTiles(){
      this.tileImageData.clear();
      this.tiles.forEach(tile => this.tileImageData.set(tile, this.tileRenderer.renderTileDataUrl(tile, this.activePalette)));
    }
}