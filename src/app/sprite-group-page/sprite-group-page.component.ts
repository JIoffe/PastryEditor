import { Component, OnInit } from '@angular/core';
import { ApplicationState } from 'src/services/application-state';

@Component({
  selector: 'app-sprite-group-page',
  templateUrl: './sprite-group-page.component.html',
  styleUrls: ['./sprite-group-page.component.css']
})
export class SpriteGroupPageComponent implements OnInit {

  constructor(private applicationState: ApplicationState) { }

  ngOnInit() {
  }

}
