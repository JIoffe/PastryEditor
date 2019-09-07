import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { ApplicationState } from 'src/services/application-state';
import { BaseSubscriberComponent } from '../base-subscriber.component';

@Component({
  selector: 'app-tile-editor',
  templateUrl: './tile-editor.component.html',
  styleUrls: ['./tile-editor.component.css']
})
export class TileEditorComponent extends BaseSubscriberComponent implements OnInit {
  @ViewChild('drawingSurface', null) drawingSurface:ElementRef;
  @ViewChild('grid', null) grid:ElementRef;
  
  showCodeEditor = false;
  code = '';
  backgroundMode = 'backdrop';
  showGrid = true;
  
  constructor(private applicationState: ApplicationState) {
    super();
  }

  ngOnInit() {
    this.redrawGrid();
  }

  canvas_onMouse(ev: MouseEvent){
    if(ev.buttons === 0)
      return;

      const rect = this.drawingSurface.nativeElement.getBoundingClientRect();
      const px = Math.floor((ev.pageX - rect.left) / (rect.right - rect.left) * 8),
            py = Math.floor((ev.pageY - rect.top) / (rect.bottom - rect.top) * 8);

      const i = px + py * 8;
      this.applicationState.activeTile[i] = this.applicationState.activeColor;
      this.applicationState.TileUpdatedObservable.next(this.applicationState.activeTile);
  }

  code_onClick(ev: MouseEvent){
    this.code = '';
    const tile = this.applicationState.activeTile;

    for(let i = 0; i < 64; i += 8){
        const line = Array.from(tile.slice(i, i+8)).map(n => n.toString(16).toUpperCase()).reduce((p,c) => p + c, '');
        this.code += `   dc.l $${line}`;
        this.code += '\r\n';
    }

    this.showCodeEditor = true;
  }

  onCodeChanged(code: string){
    if(code !== null){
      const matches = code.match(/\$[0-9A-Ea-e]{8}/g);

      if(matches === null){
        for(let i = 0; i < 64; ++i)
          this.applicationState.activeTile[i] = 0;
      }else{
        const indices = Array.from(matches.reduce((p,c) => p + c.substr(1),''));

        while(indices.length < 64)
          indices.push('0');

        indices.forEach((index, i) => {
            this.applicationState.activeTile[i] = parseInt(index, 16);
          });
      }

      this.applicationState.TileUpdatedObservable.next(this.applicationState.activeTile);
    }
    this.showCodeEditor = false;
  }

  redrawGrid(){
    const canvas = this.grid.nativeElement,
    ctx    = canvas.getContext('2d'),
    rect   = canvas.getBoundingClientRect(),
    w      = rect.right  - rect.left,
    h      = rect.bottom - rect.top;

    canvas.setAttribute('width', '' + w);
    canvas.setAttribute('height', '' + h);

    const stepX = w / 8;
    const stepY = h / 8;

    ctx.strokeStyle = '#FFF';

    for(let x = 0; x < w; x += stepX){
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }

    for(let y = 0; y < h; y += stepY){
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
  }
}
