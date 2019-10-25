import { Component, OnInit } from '@angular/core';
import { BaseSubscriberComponent } from '../base-subscriber.component';
import { ApplicationState } from 'src/services/application-state';
import { CompiledSprite } from 'src/model/compiled-sprite';

@Component({
  selector: 'app-sprite-cutter-library',
  templateUrl: './sprite-cutter-library.component.html',
  styleUrls: ['./sprite-cutter-library.component.css']
})
export class SpriteCutterLibraryComponent extends BaseSubscriberComponent {
  tooltip = '';
  code = null;

  constructor(private applicationState: ApplicationState) {
    super();
  }

  add_onClick(ev: MouseEvent){
    const sprite = new CompiledSprite();
    
    this.applicationState.compiledSprites.push(sprite);
    this.applicationState.activeCompiledSprite = sprite;
  }

  remove_onClick(ev: MouseEvent){

  }
}
