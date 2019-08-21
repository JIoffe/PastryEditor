import { Component, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { ApplicationState } from 'src/services/application-state';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private applicationState: ApplicationState){}

  title = 'Pastry';
}
