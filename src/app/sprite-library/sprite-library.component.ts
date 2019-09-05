import { Component, OnInit } from '@angular/core';
import { ApplicationState } from 'src/services/application-state';
import { BaseSubscriberComponent } from '../base-subscriber.component';
import { Sprite } from 'src/model/sprite';
import { Stamp } from 'src/model/stamp';

@Component({
  selector: 'app-sprite-library',
  templateUrl: './sprite-library.component.html',
  styleUrls: ['./sprite-library.component.css']
})
export class SpriteLibraryComponent extends BaseSubscriberComponent implements OnInit {
  tooltip: string = null;
  code: string = null;

  showNewSpriteDialog = false;

  constructor(private applicationState: ApplicationState) {
    super();
  }

  gridTemplateRows(s: Stamp){
    let prop = '';
    for(let i = s.height - 1; i >= 0; --i){
      prop += ' 1fr';
    }

    return prop;
  }


  gridTemplateColumns(s: Stamp){
    let prop = '';
    for(let i = s.width - 1; i >= 0; --i){
      prop += ' 1fr';
    }

    return prop;
  }

  ngOnInit() {
  }

  add_onClick(ev: MouseEvent){
    this.showNewSpriteDialog = true;
  }

  remove_onClick(ev: MouseEvent){
    if(!this.applicationState.activeSprite)
      return;
    
    const sprite = this.applicationState.activeSprite,
          n = sprite.width * sprite.height;

    let i = this.applicationState.tiles.indexOf(sprite.tiles[0]);
    this.applicationState.tiles.splice(i, n);

    i = this.applicationState.sprites.indexOf(sprite);
    this.applicationState.sprites.splice(i, 1);

    this.applicationState.TilesetObservable.next(this.applicationState.tiles);
    this.applicationState.SpriteSetUpdatedObservable.next(this.applicationState.sprites);

    if(this.applicationState.sprites.length > 0)
      this.applicationState.activeSprite = this.applicationState.sprites[Math.max(0, i - 1)];
    else
      this.applicationState.activeSprite = null;

    this.applicationState.SpriteSelectedObservable.next(this.applicationState.activeSprite);
  }

  icon_onClick(ev: MouseEvent, i: number){
    this.applicationState.SpriteSelectedObservable.next(this.applicationState.sprites[i]);
  }

  library_onMouseLeave(ev: MouseEvent){
    this.tooltip = '';
  }

  icon_onHover(ev: MouseEvent, i: number){
    this.tooltip = `Sprite : ${i}`;
  }

  code_onClick(ev: MouseEvent){
    let code = '';

    //Sprites are interpreted differently from tile stamps...
    // I should probably homogenize them.
    this.applicationState.sprites.forEach((sprite, i) => {
      let name = sprite.name;
      if(!name || !name.trim().length)
        name = `Sprite${i}`;

      let index = this.applicationState.tiles.indexOf(sprite.tiles[0]);
      let indexWord = index.toString(16).toUpperCase();
      while(indexWord.length < 4){
        indexWord = '0' + indexWord;
      }

      code += `${name}:\r\n`;
      code += `   dc.b $${sprite.getMDSize().toString(16).toUpperCase()}\r\n`
      code += `   dc.w $${indexWord}\r\n`;
      code += '\r\n';

    });

    this.code = code;
  }

  onCodeChanged(code: string){
    if(!!code){
    }
    this.code = null;
  }

  onSizeSelected(size: number[]){
    if(!!size){
      const w = size[0],
            h = size[1],
            n = w * h;

      //So really this just imitates the stamp library for now....
      const newTiles = new Array(n);
      for(let i = n - 1; i >= 0; --i)
        newTiles[i] = new Uint8Array(64);

      this.applicationState.tiles.push(...newTiles);
      this.applicationState.TilesetObservable.next(this.applicationState.tiles);

      const sprite = new Sprite();
      sprite.width = w;
      sprite.height = h;
      sprite.tiles = newTiles;

      sprite.resortTiles();

      this.applicationState.sprites.push(sprite);
      this.applicationState.SpriteSetUpdatedObservable.next(this.applicationState.sprites);
      this.applicationState.SpriteSelectedObservable.next(sprite);
    }

    this.showNewSpriteDialog = false;
  }
  
  cancelDialog(ev: MouseEvent){
    this.showNewSpriteDialog = false;
  }
}
