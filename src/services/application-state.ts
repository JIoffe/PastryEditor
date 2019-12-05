import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Color } from 'src/model/color';
import { Stamp } from 'src/model/stamp';
import { TileRenderer } from './tile-renderer';
import { Sprite } from 'src/model/sprite';
import { Level } from 'src/model/level';
import { SpriteGroup } from 'src/model/sprite-group';
import { MemoryMapEntry } from 'src/model/memory-map-entry';
import { CompiledSprite } from 'src/model/compiled-sprite';
import { TileCollision } from 'src/model/tile-collision';
import { ItemDefinition } from 'src/model/item-definition';

//Mostly dealing with this particular game...
import { Items } from 'src/assets/item-definitions/baolongtu-items';

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

    SpriteGroupsUpdatedObservable: Subject<SpriteGroup[]> = new Subject();
    SpriteGroupSelectedObservable: Subject<SpriteGroup> = new Subject();

    LevelsUpdatedObservable: Subject<Level[]> = new Subject();
    LevelSelectedObservable: Subject<Level> = new Subject();

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

    tileCollisionMap: Map<Uint8Array, TileCollision> = new Map();

    stamps: Stamp[] = [];
    activeStamp: Stamp = null;

    sprites: Sprite[] = [];
    activeSprite: Sprite = null;

    spriteGroups: SpriteGroup[] = [];
    activeSpriteGroup: SpriteGroup;

    traceImage: string = null;

    drawMode: string = 'p';

    memoryMap: MemoryMapEntry[] = [];
    get memoryUsage(): number{
      if(!this.memoryMap || !this.memoryMap.length)
        return 0;

      return this.memoryMap.map(m => m.size).reduce((p, c) => p + c, 0);
    }

    levels: Level[] = [];

    private _activeLevel: Level = null;
    get activeLevel(): Level {
        return this._activeLevel;
    }
    set activeLevel(level: Level) {
        this._activeLevel = level;
        this.LevelSelectedObservable.next(level);
    }

    activePattern: Level = null;

    compiledSprites: CompiledSprite[] = [];
    activeCompiledSprite: CompiledSprite = null;

    levelEditMode = 'tiles';

    eraserWidth = 1;
    eraserHeight = 1;

    itemDefinitions: ItemDefinition[] = Items;
    selectedItemDefinition: ItemDefinition = null;

    constructor(private tileRenderer: TileRenderer){
        //This is a singleton so these watchers do not need to be cleared
        this.TileUpdatedObservable.subscribe(tile => {
          this.tileImageData.set(tile, this.tileRenderer.renderTileDataUrl(tile, this.activePalette));
          this.autoPopulateTileHeightmap(tile);
        });

        this.TileSelectedObservable.subscribe(tile => this.activeTile = tile);

        this.TilesetObservable.subscribe(tiles => {
          this.tiles = tiles;
          this.tiles.forEach(tile => {
            if(this.tileCollisionMap.has(tile))
              return;

            this.autoPopulateTileHeightmap(tile);
          });
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

        this.LevelsUpdatedObservable.subscribe(levels => this.levels = levels);

        this.SpriteGroupSelectedObservable.subscribe(sg => this.activeSpriteGroup = sg);
        this.SpriteGroupsUpdatedObservable.subscribe(sgs => this.spriteGroups = sgs);
    }

    redrawAllTiles(){
      this.tileImageData.clear();
      this.tiles.forEach(tile => this.tileImageData.set(tile, this.tileRenderer.renderTileDataUrl(tile, this.activePalette)));
    }

    addSprite(sprite: Sprite){
      this.tiles.push(...sprite.tiles);
      this.TilesetObservable.next(this.tiles);

      this.sprites.push(sprite);
      this.SpriteSetUpdatedObservable.next(this.sprites);
      this.SpriteSelectedObservable.next(sprite);
    }

    addSprites(...sprites: Sprite[]){
      if(!sprites || !sprites.length)
        return;

      sprites.forEach(s => {
        this.tiles.push(...s.tiles);
        this.sprites.push(s);
      });

      this.TilesetObservable.next(this.tiles);
      this.SpriteSetUpdatedObservable.next(this.sprites);
    }

    removeSprite(sprite: Sprite){
      const n = sprite.width * sprite.height;

      let i = this.tiles.indexOf(sprite.tiles[0]);
      this.tiles.splice(i, n);

      i = this.sprites.indexOf(sprite);
      this.sprites.splice(i, 1);

      this.TilesetObservable.next(this.tiles);
      this.SpriteSetUpdatedObservable.next(this.sprites);

      if(this.sprites.length > 0)
        this.activeSprite = this.sprites[Math.max(0, i - 1)];
      else
        this.activeSprite = null;

      this.SpriteSelectedObservable.next(this.activeSprite);
    }

    removeSprites(...sprites: Sprite[]){
      if(!sprites)
        return;

      sprites.forEach(s => this.removeSprite(s));
    }

    addSpriteGroup(spriteGroup: SpriteGroup){
      spriteGroup.sprites.forEach(s => this.addSprite(s));
      this.spriteGroups.push(spriteGroup);
      this.SpriteGroupsUpdatedObservable.next(this.spriteGroups);
    }

    removeCompiledSprite(compiledSprite: CompiledSprite){
      if(!compiledSprite)
        return;

      const i = this.compiledSprites.indexOf(compiledSprite);
      this.removeSprites(...compiledSprite.completeSpriteSet);
      this.compiledSprites.splice(i, 1);
      this.activeCompiledSprite = this.compiledSprites[Math.max(i - 1, 0)] || this.compiledSprites[0] || null;

      this.SpriteSetUpdatedObservable.next(this.sprites);
      this.TilesetObservable.next(this.tiles);
      this.SpriteSelectedObservable.next(null);
    }

    removeCompiledSprites(...compiledSprites: CompiledSprite[]){
      if(!compiledSprites || !compiledSprites.length)
        return;
      
      compiledSprites.forEach(compiledSprite => {
        const i = this.compiledSprites.indexOf(compiledSprite);
        this.removeSprites(...compiledSprite.completeSpriteSet);
        this.compiledSprites.splice(i, 1);
      });

      this.activeCompiledSprite = null;
  
      this.SpriteSetUpdatedObservable.next(this.sprites);
      this.TilesetObservable.next(this.tiles);
      this.SpriteSelectedObservable.next(null);
    }

    addCompiledSprites(...compiledSprites: CompiledSprite[]){
      if(!compiledSprites || !compiledSprites.length)
        return;
      
      compiledSprites.forEach(compiledSprite => {
        this.compiledSprites.push(compiledSprite);
        this.addSprites(...compiledSprite.completeSpriteSet);
      });
    }

    replaceActiveCompiledSprite(compiledSprite: CompiledSprite){
      let i: number;
      if(!!this.activeCompiledSprite){
        i = this.compiledSprites.indexOf(this.activeCompiledSprite);
        this.removeSprites(...this.activeCompiledSprite.completeSpriteSet);
      }else{
        i = this.compiledSprites.length;
        if(i === 0){
          this.compiledSprites.push(null);
        }
      }

      this.compiledSprites[i] = compiledSprite;
      this.activeCompiledSprite = compiledSprite;
      this.addSprites(...compiledSprite.completeSpriteSet);
    }

    removeTiles(...tiles: Uint8Array[]){
      if(!tiles)
        return;

      tiles.forEach(t => {
        const i = this.tiles.indexOf(t);
        if(i < 0)
          return;

        this.tiles.splice(i, 1);
      });
    }

    autoPopulateTileHeightmap(tile: Uint8Array){
      const heightmap = new Uint8Array(8);
      for(let i = 7; i >= 0; --i){
        let columnHeight = 0;
        for(let y = 0; y < 8; ++y){
          if(tile[i + y * 8] !== 0){
            columnHeight = 7 - y;
            break;
          }
        }

        heightmap[i] = columnHeight + 1;
      }

      const collision = {
        isWall: true,
        isFloor: true,
        isCeiling: true,
        heightmap: heightmap
      };
      
      this.tileCollisionMap.set(tile, collision);
    }
}