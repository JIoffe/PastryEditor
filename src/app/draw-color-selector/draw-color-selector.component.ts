import { Component } from '@angular/core';
import { ApplicationState } from 'src/services/application-state';

@Component({
  selector: 'app-draw-color-selector',
  templateUrl: './draw-color-selector.component.html',
  styleUrls: ['./draw-color-selector.component.css']
})
export class DrawColorSelectorComponent {
  constructor(private applicationState: ApplicationState) { }

  swatch_onClick(ev: MouseEvent, color: number){
    this.applicationState.activeColor = color;
  }
}
