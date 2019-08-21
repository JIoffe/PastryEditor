import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { Color } from 'src/model/color';
import { ApplicationState } from 'src/services/application-state';

@Component({
  selector: 'app-tile-editor',
  templateUrl: './tile-editor.component.html',
  styleUrls: ['./tile-editor.component.css']
})
export class TileEditorComponent implements OnInit {
  @ViewChild('drawCanvas', null) drawCanvas:ElementRef;
  @Input() activeTile: Uint8Array;
  @Input() palette: Color[];
  
  showCodeEditor = false;
  code = '';
  activeColor = 0;
  transparentPixelMode = 'palette';
  
  constructor(private applicationState: ApplicationState) {
    applicationState.PaletteObservable.subscribe(palette => {
      this.updateCanvas();
    });

    applicationState.TileUpdatedObservable.subscribe(tile => {
      if(tile === this.activeTile){
        this.updateCanvas();
      }
    });

    applicationState.TileSelectedObservable.subscribe(tile => {
      this.activeTile = tile;
      this.updateCanvas();
    });

    applicationState.PaletteObservable.subscribe(palette => {
      this.palette = palette;
      this.updateCanvas();
    });
  }

  ngOnInit() {
    this.palette = this.applicationState.activePalette;
    this.activeTile = this.applicationState.activeTile;
    this.updateCanvas();
  }

  canvas_onMouse(ev: MouseEvent){
    if(ev.buttons === 0)
      return;

      const rect = this.drawCanvas.nativeElement.getBoundingClientRect();
      const px = Math.floor((ev.pageX - rect.left) / (rect.right - rect.left) * 8),
            py = Math.floor((ev.pageY - rect.top) / (rect.bottom - rect.top) * 8);

      const i = px + py * 8;
      this.activeTile[i] = this.activeColor;
      this.applicationState.TileUpdatedObservable.next(this.activeTile);
  }

  swatch_onClick(ev: MouseEvent, index: number){
    this.activeColor = index;
  }

  code_onClick(ev: MouseEvent){
    this.code = '';
    const tile = this.activeTile;

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
          this.activeTile[i] = 0;
      }else{
        const indices = Array.from(matches.reduce((p,c) => p + c.substr(1),''));

        while(indices.length < 64)
          indices.push('0');

        indices.forEach((index, i) => {
            this.activeTile[i] = parseInt(index, 16);
          });
      }

      this.applicationState.TileUpdatedObservable.next(this.activeTile);
    }
    this.showCodeEditor = false;
  }

  updateCanvas(){
    const canvasRect = this.drawCanvas.nativeElement.getBoundingClientRect();
    const w = canvasRect.right - canvasRect.left,
          h = canvasRect.bottom - canvasRect.top;

    this.drawCanvas.nativeElement.setAttribute('width', w + '');
    this.drawCanvas.nativeElement.setAttribute('height', h + '');

    const ctx = this.drawCanvas.nativeElement.getContext('2d');

    const pixelWidth = w / 8,
    pixelHeight = h / 8;

    //Draw transparent pattern
    if(this.transparentPixelMode === 'pattern'){
      let darker = true;
      const patternW = pixelWidth / 2;
      const patternH = pixelHeight / 2;
      for(let i = 0; i < 16; ++i){
        for(let j = 0; j < 16; ++j){
            ctx.fillStyle = darker ? '#D4D4D4' : '#FEFEFE';
            darker = !darker;
            ctx.fillRect(i * patternW, j * patternH, patternW, patternH);
        }
        darker = !darker;
      }
    }else{
      ctx.fillStyle = this.palette[0].toCSS();
      ctx.fillRect(0,0,w,h);
    }

    for(let x = 0; x < 8; ++x){
      for(let y = 0; y < 8; ++y){
          const i = x + y * 8;
          const colorIndex = this.activeTile[i];
          if(colorIndex === 0) //transparent
              continue;

          const color = this.palette[colorIndex];
          ctx.fillStyle = color.toCSS();
          ctx.fillRect(x * pixelWidth, y * pixelHeight, pixelWidth, pixelHeight);
      }
    }

    ctx.strokeStyle = '#DDD';
    for(let i = 0; i <= 8; ++i){
      ctx.beginPath();
      var x = Math.min(i * pixelWidth, w);
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }

    for(let i = 0; i <= 8; ++i){
      ctx.beginPath();
      var y = Math.min(i * pixelHeight, h);
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
  }
}
