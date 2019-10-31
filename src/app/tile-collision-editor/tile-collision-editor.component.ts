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

    var h = new Uint8Array(this.applicationState.tileCollisionMap.get(this.applicationState.activeTile).heightmap);
    h[px] = 8 - py;

    this.applicationState.tileCollisionMap.get(this.applicationState.activeTile).heightmap = h;
  }

  code_onClick(ev: MouseEvent){

  }
}
