import { Component, OnInit } from '@angular/core';
import { ApplicationState } from 'src/services/application-state';

@Component({
  selector: 'app-draw-tool-selector',
  templateUrl: './draw-tool-selector.component.html',
  styleUrls: ['./draw-tool-selector.component.css']
})
export class DrawToolSelectorComponent implements OnInit {

  constructor(private applicationState: ApplicationState) { }

  ngOnInit() {
  }

  onToolClick(ev: MouseEvent, drawMode: string){
    this.applicationState.drawMode = drawMode;
  }
}
