import { Component } from '@angular/core';
import { ApplicationState } from 'src/services/application-state';
import { SpriteGroup } from 'src/model/sprite-group';
import { FormattingUtils } from 'src/utils/formatting-utils';

@Component({
  selector: 'app-sprite-group-library',
  templateUrl: './sprite-group-library.component.html',
  styleUrls: ['./sprite-group-library.component.css']
})
export class SpriteGroupLibraryComponent{
  showNewSpriteDialog: boolean = false;
  code: string = null;
  tooltip: string = '';

  constructor(private applicationState: ApplicationState) { }

  add_onClick(ev: MouseEvent){
    this.showNewSpriteDialog = true;
  }

  remove_onClick(ev: MouseEvent){
    if(!this.applicationState.activeSpriteGroup)
      return;
  
  }

  icon_onClick(ev: MouseEvent, i: number){
    
  }

  library_onMouseLeave(ev: MouseEvent){
    this.tooltip = '';
  }

  icon_onHover(ev: MouseEvent, i: number){
    this.tooltip = `Sprite Group : ${i}`;
  }

  code_onClick(ev: MouseEvent){
    let code =  '; Sprite groups are meant to be sprites\r\n' +
                '; that combine into one image\r\n' +
                `; ${this.applicationState.spriteGroups.length} sprite group(s)\r\n`;

    this.applicationState.spriteGroups.forEach((spriteGroup, i) => {
      let name = spriteGroup.name || `SpriteGroup${i}`;
      //Pattern is: 
      // Number of Sprites: Word
      // HHWW   in pixels:  WORD
      // Per Sprite:
      //              Offset (YYXX) (IN PIXELS) (WORD)
      //              Size (byte)
      //              Starting Index (WORD)

      code += `   dc.w $${FormattingUtils.padWord(spriteGroup.sprites.length)}\r\n`
      code += `   dc.w $${FormattingUtils.padByte(spriteGroup.height * 8)}${FormattingUtils.padByte(spriteGroup.width * 8)}\r\n`

      spriteGroup.sprites.forEach((sprite, j) => {
        let index = this.applicationState.tiles.indexOf(sprite.tiles[0]);
        let offset = spriteGroup.getSpriteOffset(sprite);

        let link = j === spriteGroup.sprites.length - 1 ? 0 : (j + 1);

        code += `   dc.w $${FormattingUtils.padByte(offset[1])}${FormattingUtils.padByte(offset[0])}\r\n`
        code += `   dc.w $0${sprite.getMDSize().toString(16).toUpperCase()}${FormattingUtils.padByte(link)}\r\n`
        code += `   dc.w $${FormattingUtils.padWord(index)}\r\n`;
      })
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
      var spriteGroup = new SpriteGroup(size[0], size[1]);
      this.applicationState.addSpriteGroup(spriteGroup)
      this.applicationState.SpriteGroupSelectedObservable.next(spriteGroup);
    }
    
    this.showNewSpriteDialog = false;
  }
  
  cancelDialog(ev: MouseEvent){
    this.showNewSpriteDialog = false;
  }
}
