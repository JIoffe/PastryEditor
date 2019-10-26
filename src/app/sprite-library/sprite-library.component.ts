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
    this.applicationState.redrawAllTiles();
  }

  add_onClick(ev: MouseEvent){
    this.showNewSpriteDialog = true;
  }

  remove_onClick(ev: MouseEvent){
    if(!this.applicationState.activeSprite)
      return;
    
      this.applicationState.removeSprite(this.applicationState.activeSprite);
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
      code += `   dc.b $0${sprite.getMDSize().toString(16).toUpperCase()}\r\n`
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
      const sprite = new Sprite(size[0], size[1]);
      this.applicationState.addSprite(sprite);
      this.applicationState.SpriteSelectedObservable.next(sprite);
    }

    this.showNewSpriteDialog = false;
  }
  
  cancelDialog(ev: MouseEvent){
    this.showNewSpriteDialog = false;
  }
}
