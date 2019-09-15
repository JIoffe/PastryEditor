import { Component, OnInit } from '@angular/core';
import { ApplicationState } from 'src/services/application-state';
import { Level } from 'src/model/level';

@Component({
  selector: 'app-level-library',
  templateUrl: './level-library.component.html',
  styleUrls: ['./level-library.component.css']
})
export class LevelLibraryComponent implements OnInit {

  showNewLevelModal = false;
  newLevelWidth = 1;
  newLevelHeight = 1;
  newLevelName = 'untitled';

  constructor(private applicationState: ApplicationState) { }

  ngOnInit() {
  }

  //For new levels
  add_onClick(ev: MouseEvent){
    this.showNewLevelModal = true;
  }

  remove_onClick(ev: MouseEvent){

  }

  newLevelOk(ev: MouseEvent){
    const level = new Level();
    level.name = this.newLevelName;
    level.height = this.newLevelHeight;
    level.width = this.newLevelWidth;

    this.applicationState.levels.push(level);
    this.applicationState.LevelsUpdatedObservable.next(this.applicationState.levels);
    this.applicationState.LevelSelectedObservable.next(level);
    this.showNewLevelModal = false;
  }

  newLevelCancel(ev: MouseEvent){
    this.showNewLevelModal = false;
  }
}
