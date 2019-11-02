import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { BaseSubscriberComponent } from '../base-subscriber.component';
import { ApplicationState } from 'src/services/application-state';

@Component({
  selector: 'app-tile-collision-editor',
  templateUrl: './tile-collision-editor.component.html',
  styleUrls: ['./tile-collision-editor.component.css']
})
export class TileCollisionEditorComponent extends BaseSubscriberComponent implements OnInit {
  @ViewChild('viewport', null) viewport:ElementRef;
  
  constructor(private applicationState: ApplicationState) { 
    super();
  }

  ngOnInit() {
  }

  heightmapMouse(ev: MouseEvent){
    if(ev.buttons === 0)
      return;

    if(!this.applicationState.activeTile)
      return;

    const rect = this.viewport.nativeElement.getBoundingClientRect(),
          px = Math.floor((ev.pageX - rect.left) / (rect.right - rect.left) * 8),
          py = Math.floor((ev.pageY - rect.top) / (rect.bottom - rect.top) * 8);

    const collision = this.applicationState.tileCollisionMap.get(this.applicationState.activeTile);
    collision.heightmap[px] = collision.isCeiling && !collision.isFloor ? py + 1:  8 - py;

    this.applicationState.tileCollisionMap.set(this.applicationState.activeTile, Object.assign({}, collision));
  }

  flagsChanged(){
    if(!this.applicationState.activeTile)
      return;

      const collision = this.applicationState.tileCollisionMap.get(this.applicationState.activeTile);  
      this.applicationState.tileCollisionMap.set(this.applicationState.activeTile, Object.assign({}, collision));
  }

  code_onClick(ev: MouseEvent){

  }
}
