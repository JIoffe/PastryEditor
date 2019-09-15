import { Component } from '@angular/core';
import { ApplicationState } from 'src/services/application-state';
import { SpriteGroup } from 'src/model/sprite-group';

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
