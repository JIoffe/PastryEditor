import { Component, OnInit } from '@angular/core';
import { BaseSubscriberComponent } from '../base-subscriber.component';
import { ApplicationState } from 'src/services/application-state';

@Component({
  selector: 'app-sprite-cutter-page',
  templateUrl: './sprite-cutter-page.component.html',
  styleUrls: ['./sprite-cutter-page.component.css']
})
export class SpriteCutterPageComponent extends BaseSubscriberComponent {
  constructor(private applicationState: ApplicationState) {
    super();
  }
}
