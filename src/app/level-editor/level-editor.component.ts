import { Component, OnInit } from '@angular/core';
import { ApplicationState } from 'src/services/application-state';

@Component({
  selector: 'app-level-editor',
  templateUrl: './level-editor.component.html',
  styleUrls: ['./level-editor.component.css']
})
export class LevelEditorComponent implements OnInit {
  zoom = 100.0;

  constructor(private applicationState: ApplicationState) { }

  ngOnInit() {
  }

}
