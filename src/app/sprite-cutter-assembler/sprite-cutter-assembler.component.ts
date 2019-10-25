import { Component, ViewChild, ElementRef, Input, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { interval } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { BaseSubscriberComponent } from '../base-subscriber.component';
import { ApplicationState } from 'src/services/application-state';
import { Color } from 'src/model/color';
import { PalettizedImage } from 'src/model/palettized-image';
import { SpriteFrame } from 'src/model/sprite-frame';
import { PositionedSprite } from 'src/model/positioned-sprite';

@Component({
  selector: 'app-sprite-cutter-assembler',
  templateUrl: './sprite-cutter-assembler.component.html',
  styleUrls: ['./sprite-cutter-assembler.component.css']
})
export class SpriteCutterAssemblerComponent extends BaseSubscriberComponent implements OnInit{
  @ViewChild('drawCanvas', null) drawCanvas:ElementRef;
  @Input() image:PalettizedImage;
  @Output() frameProcessed = new EventEmitter<SpriteFrame>();

  frame: SpriteFrame;

  cursorX: number = -1;
  cursorY: number = -1;

  cursorWidth: number = 1;
  cursorHeight: number = 1;

  cursorFlash: boolean = false;
  pixelSizeMultiplier: number = 6;
  
  constructor(private applicationState: ApplicationState) {
    super();
  }

  ok_click(ev: MouseEvent){
    //Time to assemble the frames
    this.frame.sprites.forEach(s => {
      const w = s.width * 8,
            h = s.height * 8;
      
      for(let x = w - 1; x >= 0; --x){
        for(let y = h - 1; y >= 0; --y){
          const x1 = x + s.offsetX,
                y1 = y + s.offsetY;

          const index = this.image.indices[x1 + y1 * this.image.width];
          s.setTexel(x, y, index);
        }
      }
    });
    
    this.frameProcessed.emit(this.frame);
  }

  cancel_click(ev: MouseEvent){
    this.frameProcessed.emit(null);
  }

  assemblerMouseMove(ev: MouseEvent){
    const canvas = this.drawCanvas.nativeElement,
          rect   = canvas.getBoundingClientRect();

    const x = ev.pageX - rect.left,
          y = ev.pageY - rect.top;

    this.cursorX = x - x % this.pixelSizeMultiplier;
    this.cursorY = y - y % this.pixelSizeMultiplier;
  }

  assemblerClick(ev: MouseEvent){
    const s = new PositionedSprite(this.cursorWidth, this.cursorHeight);
    s.offsetX = this.cursorX / this.pixelSizeMultiplier;
    s.offsetY = this.cursorY / this.pixelSizeMultiplier;

    this.frame.sprites.push(s);
  }

  render(){
    if(!this.image)
      return;

    const canvas = this.drawCanvas.nativeElement,
          ctx    = canvas.getContext('2d'),
          rect   = canvas.getBoundingClientRect(),
          w      = rect.right  - rect.left,
          h      = rect.bottom - rect.top;

    canvas.setAttribute('width', '' + w);
    canvas.setAttribute('height', '' + h);

    const palette = this.applicationState.activePalette;

    const buffer = ctx.createImageData(w, h);
    const data = buffer.data;

    for(let x = w - 1; x >= 0 ; --x){
      for(let y = h - 1; y >= 0; --y){
        const pixelI = (x + y * w) * 4;

        const srcX = Math.floor(x / this.pixelSizeMultiplier),
              srcY = Math.floor(y / this.pixelSizeMultiplier);

        let srcColor: Color;

        if(srcX < this.image.width && srcY < this.image.height){
          const srcI = srcX + srcY * this.image.width;

          srcColor = palette[this.image.indices[srcI]];
        }else{
          srcColor = palette[0];
        }

        data[pixelI] = srcColor.r;
        data[pixelI + 1] = srcColor.g;
        data[pixelI + 2] = srcColor.b;
        data[pixelI + 3] = 255;
      }
    }

    ctx.putImageData(buffer, 0, 0);
  }

  ngOnInit(): void {
    this.frame = {
      sprites: []
    };

    this.render();

    //Setup flicker interval
    interval(200)
      .pipe(takeUntil(this.$destruction))
      .subscribe(s => {
        this.cursorFlash = !this.cursorFlash;
      });
  }
}
