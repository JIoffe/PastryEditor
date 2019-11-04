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

  code: string = null;

  constructor(private applicationState: ApplicationState) { }

  ngOnInit() {
  }

  //For new levels
  add_onClick(ev: MouseEvent){
    this.showNewLevelModal = true;
  }

  remove_onClick(ev: MouseEvent){
    if(!this.applicationState.activeLevel)
      return;

    var index = this.applicationState.levels.indexOf(this.applicationState.activeLevel);
    this.applicationState.levels.splice(index, 1);
    this.applicationState.LevelsUpdatedObservable.next(this.applicationState.levels);

    if(this.applicationState.levels.length >= 0){
      const nextLevel = this.applicationState.levels[index] || this.applicationState.levels[index - 1];
      this.applicationState.LevelSelectedObservable.next(nextLevel);
    }else{
      this.applicationState.LevelSelectedObservable.next(null);
    }
  }

  newLevelOk(ev: MouseEvent){
    const level = new Level(this.newLevelName, this.newLevelWidth, this.newLevelHeight);

    this.applicationState.levels.push(level);
    this.applicationState.LevelsUpdatedObservable.next(this.applicationState.levels);
    this.applicationState.LevelSelectedObservable.next(level);
    this.showNewLevelModal = false;
  }

  newLevelCancel(ev: MouseEvent){
    this.showNewLevelModal = false;
  }

  code_onClick(ev: MouseEvent){
    if(!!this.applicationState.levels.length){
      this.code = Level.manyToCode(this.applicationState.levels);
    }else{
      this.code = '';
    }    
  }

  onCodeChanged(code: string){
    if(!!code){
      this.applicationState.levels = Level.manyFromCode(code);
      this.applicationState.activeLevel = this.applicationState.levels[0] || null;
      this.applicationState.LevelsUpdatedObservable.next(this.applicationState.levels);
    }
    this.code = null;
  }
}
