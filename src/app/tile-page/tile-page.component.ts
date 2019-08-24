import { Component, OnInit } from '@angular/core';
import { ApplicationState } from 'src/services/application-state';

@Component({
  selector: 'app-tile-page',
  templateUrl: './tile-page.component.html',
  styleUrls: ['./tile-page.component.css']
})
export class TilePageComponent implements OnInit {

  constructor(private applicationState: ApplicationState) { }

  ngOnInit() {
  }

}
