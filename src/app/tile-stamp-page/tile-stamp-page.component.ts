import { Component, OnInit } from '@angular/core';
import { ApplicationState } from 'src/services/application-state';

@Component({
  selector: 'app-tile-stamp-page',
  templateUrl: './tile-stamp-page.component.html',
  styleUrls: ['./tile-stamp-page.component.css']
})
export class TileStampPageComponent implements OnInit {

  constructor(private applicationState: ApplicationState) { }

  ngOnInit() {
  }
}
