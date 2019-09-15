import { Component, OnInit } from '@angular/core';
import { ApplicationState } from 'src/services/application-state';

@Component({
  selector: 'app-level-page',
  templateUrl: './level-page.component.html',
  styleUrls: ['./level-page.component.css']
})
export class LevelPageComponent implements OnInit {
  constructor(private applicationState: ApplicationState) { }

  ngOnInit() {
  }

}
