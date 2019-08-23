import { Component, OnInit } from '@angular/core';
import { ApplicationState } from 'src/services/application-state';
import { Stamp } from 'src/model/stamp';
import { BaseSubscriberComponent } from '../base-subscriber.component';
import { TileRenderer } from 'src/services/tile-renderer';

@Component({
  selector: 'app-tile-stamp-library',
  templateUrl: './tile-stamp-library.component.html',
  styleUrls: ['./tile-stamp-library.component.css']
})
export class TileStampLibraryComponent extends BaseSubscriberComponent implements OnInit {
  stamps: Stamp[] = null;
  activeStamp: Stamp = null;
  code: string = null;
  icons: string[] = null;
  tooltip = '';

  showNewStampDialog = false;
  stampDialogHeight = 2;
  stampDialogWidth = 2;

  constructor(private applicationState: ApplicationState, private tileRenderer: TileRenderer) {
    super();
  }

  ngOnInit() {
    this.subscribe(
      this.applicationState.StampsetUpdatedObservable.subscribe(stamps => {
        this.stamps = stamps;
        this.redrawAllStamps();
      }),

      this.applicationState.StampSelectedObservable.subscribe(stamp => this.activeStamp = stamp),

      this.applicationState.TileUpdatedObservable.subscribe(tile => {
        this.redrawAllStamps();
      })
    )
    this.stamps = this.applicationState.stamps;
    this.activeStamp = this.applicationState.activeStamp;
    
    this.redrawAllStamps();
  }

  redrawAllStamps(){
    this.icons = this.stamps.map(stamp => this.tileRenderer.renderStampDataUrl(stamp, this.applicationState.activePalette));
  }

  add_onClick(ev: MouseEvent){
    this.stampDialogHeight = 2;
    this.stampDialogWidth = 2;
    this.showNewStampDialog = true;
  }

  remove_onClick(ev: MouseEvent){
    if(!this.activeStamp)
      return;

    const n = this.activeStamp.width * this.activeStamp.height;
    let i = this.applicationState.tiles.indexOf(this.activeStamp.tiles[0]);

    this.applicationState.tiles.splice(i, n);

    i = this.applicationState.stamps.indexOf(this.activeStamp);
    this.applicationState.stamps.splice(i, 1);

    this.applicationState.TilesetObservable.next(this.applicationState.tiles);
    this.applicationState.StampsetUpdatedObservable.next(this.applicationState.stamps);

    if(this.applicationState.stamps.length > 0)
      this.activeStamp = this.applicationState.stamps[Math.max(0, i - 1)];
    else
      this.activeStamp = null;

    this.applicationState.StampSelectedObservable.next(this.activeStamp);
  }

  addStamp(ev: MouseEvent){
    const n = this.stampDialogHeight * this.stampDialogWidth;
    const newTiles = new Array(n);
    for(let i = n - 1; i >= 0; --i)
      newTiles[i] = new Uint8Array(64);

    this.applicationState.tiles.push(...newTiles);
    this.applicationState.TilesetObservable.next(this.applicationState.tiles);

    const stamp = new Stamp();
    stamp.width = this.stampDialogWidth;
    stamp.height = this.stampDialogHeight;
    stamp.tiles = newTiles;

    this.applicationState.stamps.push(stamp);
    this.applicationState.StampsetUpdatedObservable.next(this.applicationState.stamps);
    this.applicationState.StampSelectedObservable.next(stamp);

    this.showNewStampDialog = false;
  }

  cancelStampDialog(ev: MouseEvent){
    this.showNewStampDialog = false;
  }

  library_onMouseLeave(ev: MouseEvent){
    this.tooltip = '';
  }

  icon_onHover(ev: MouseEvent, i: number){
    this.tooltip = `Stamp: ${i}`;
  }
}
