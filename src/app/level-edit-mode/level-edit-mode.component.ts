import { Component, OnInit } from '@angular/core';
import { ApplicationState } from 'src/services/application-state';

@Component({
  selector: 'app-level-edit-mode',
  templateUrl: './level-edit-mode.component.html',
  styleUrls: ['./level-edit-mode.component.css']
})
export class LevelEditModeComponent implements OnInit {

  tooltip = '';
  
  constructor(private applicationState: ApplicationState) { }

  ngOnInit() {
  }

  library_onMouseLeave(ev: MouseEvent){
    this.tooltip = '';
  }

  icon_onHover(ev: MouseEvent, i: number){
    switch(this.applicationState.levelEditMode){
      case 'stamps':
          this.tooltip = `Stamp: ${i}`;
        break;
      case 'tiles':
      default:
          this.tooltip = `Tile: ${i}`;
        break;
    } 
  }

  icon_onClick(ev: MouseEvent, i: number){
    switch(this.applicationState.levelEditMode){
      case 'stamps':
        this.applicationState.StampSelectedObservable.next(this.applicationState.stamps[i]);
        break;
      case 'tiles':
      default:
        this.applicationState.TileSelectedObservable.next(this.applicationState.tiles[i]);
        break;
    }
  }
}
