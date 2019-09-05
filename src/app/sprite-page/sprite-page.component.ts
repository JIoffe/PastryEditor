import { Component, OnInit } from '@angular/core';
import { ApplicationState } from 'src/services/application-state';

@Component({
  selector: 'app-sprite-page',
  templateUrl: './sprite-page.component.html',
  styleUrls: ['./sprite-page.component.css']
})
export class SpritePageComponent implements OnInit {

  constructor(private applicationState: ApplicationState) { }

  ngOnInit() {
  }

}
