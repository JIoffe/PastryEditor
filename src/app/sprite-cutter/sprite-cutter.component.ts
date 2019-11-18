import { Component, OnInit, OnChanges, SimpleChanges, ViewChild, ElementRef } from '@angular/core';
import { BaseSubscriberComponent } from '../base-subscriber.component';
import { ApplicationState } from 'src/services/application-state';
import { SpriteAnimation } from 'src/model/sprite-animation';
import { PalettizedImage } from 'src/model/palettized-image';
import { SpriteFrame } from 'src/model/sprite-frame';
import { interval } from 'rxjs/internal/observable/interval';
import { takeUntil } from 'rxjs/operators';
import { CompiledSprite } from 'src/model/compiled-sprite';

@Component({
  selector: 'app-sprite-cutter',
  templateUrl: './sprite-cutter.component.html',
  styleUrls: ['./sprite-cutter.component.css']
})
export class SpriteCutterComponent extends BaseSubscriberComponent implements OnInit, OnChanges{
  @ViewChild('drawCanvas', null) drawCanvas:ElementRef;
  code: string = null;
  activeAnimation: SpriteAnimation = null;
  activeFrame: number = 0;

  showBounds: boolean = false;

  zoom: number = 100;
  cursorFlash: boolean = false;

  showImageSelection = false;

  assemblerImage: PalettizedImage = null;

  constructor(private applicationState: ApplicationState) {
    super();
  }

  ngOnInit(): void {
    this.resetActiveAnimation();
    this.render();

    //Setup flicker interval
    interval(200)
      .pipe(takeUntil(this.$destruction))
      .subscribe(s => {
        this.cursorFlash = !this.cursorFlash;
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.resetActiveAnimation();
    this.render();
  }

  onZoomChange(){
    this.render();
  }

  add_onClick(ev: MouseEvent){
    if(!this.applicationState.activeCompiledSprite)
      return;

    const anim = {
      name: 'Untitled',
      frames: []
    }

    this.applicationState.activeCompiledSprite.animations.push(anim);
    this.activeAnimation = anim;
    this.resetFrame();
    this.render();
  }

  remove_onClick(ev: MouseEvent){
    if(!this.applicationState.activeCompiledSprite)
      return;

    if(!this.activeAnimation)
      return;

    const i = this.applicationState.activeCompiledSprite.animations.indexOf(this.activeAnimation);
    if(i < 0)
      return;

    this.applicationState.activeCompiledSprite.animations.splice(i, 1);

    const newIndex = i === 0 ? this.applicationState.activeCompiledSprite.animations.length - 1 : i - 1;
    this.activeAnimation = this.applicationState.activeCompiledSprite.animations[newIndex] || null;
    this.resetFrame();
    this.render();
  }

  importImageClick(ev: MouseEvent){
    this.showImageSelection = true;
  }

  removeFrameClick(ev: MouseEvent){
    if(!this.activeAnimation || !this.activeAnimation.frames || !this.activeAnimation.frames.length)
      return;

    this.activeAnimation.frames.splice(this.activeFrame, 1);
    this.activeFrame = Math.max(0, this.activeFrame - 1);
    this.render();
  }

  previousFrameClick(ev: MouseEvent){
    if(!this.activeAnimation)
      return;

      if(this.activeFrame > 0){
        this.activeFrame--;
      }else{
        this.activeFrame = this.activeAnimation.frames.length - 1;
      }
      this.render();
  }

  nextFrameClick(ev: MouseEvent){
    if(!this.activeAnimation)
      return;

    if(this.activeFrame < this.activeAnimation.frames.length - 1){
      this.activeFrame++;
    }else{
      this.activeFrame = 0;
    }
    this.render();
  }

  addFrameClick(ev: MouseEvent){
    if(!this.activeAnimation)
      return;

    this.activeFrame = this.activeAnimation.frames.length;
    this.activeAnimation.frames.push({
      sprites: []
    });
    this.render();
  }

  animationChanged(){
    this.resetFrame();
    this.render();
  }

  render(){
    if(!this.activeAnimation || !this.activeAnimation.frames || !this.activeAnimation.frames.length)
      return;

    const canvas = this.drawCanvas.nativeElement,
          ctx    = canvas.getContext('2d'),
          rect   = canvas.getBoundingClientRect(),
          w      = rect.right  - rect.left,
          h      = rect.bottom - rect.top;

    canvas.setAttribute('width', '' + w);
    canvas.setAttribute('height', '' + h);

    ctx.fillStyle = this.applicationState.activePalette[0].toCSS();
    ctx.fillRect(0,0,w,h);

    const buffer = ctx.getImageData(0,0,w, h);
    const data = buffer.data;

    const tileScale = this.zoom * 0.08;
    const pixelScale = this.zoom * 0.01;

    this.activeAnimation.frames[this.activeFrame].sprites.forEach(s => {
      const sw = Math.floor(s.width * tileScale),
            sh = Math.floor(s.height * tileScale);

      for(let x = sw - 1; x >= 0; --x){
        for(let y = sh - 1; y >= 0; --y){
          const x1 = Math.floor(x + s.offsetX * pixelScale),
                y1 = Math.floor(y + s.offsetY * pixelScale);

          if(x1 >= w || y1 >= h)
            continue;

          const srcX = Math.floor((x / sw) * (s.width * 8));
          const srcY = Math.floor((y / sh) * (s.height * 8));
          const index = s.getTexel(srcX, srcY);
          const color = this.applicationState.activePalette[index];

          const pixelI = (x1 + y1 * w) * 4;
          data[pixelI] = color.r;
          data[pixelI + 1] = color.g;
          data[pixelI + 2] = color.b;
          data[pixelI + 3] = 255;
        }
      }
    });

    ctx.putImageData(buffer, 0, 0);
  }

  onImageProcessed(image: PalettizedImage){
    if(!!image){
      this.assemblerImage = image;
    }

    this.showImageSelection = false;
  }

  onFrameProcessed(frame: SpriteFrame){
    this.assemblerImage = null;

    if(!frame)
      return;

    this.activeAnimation.frames[this.activeFrame] = frame;

    this.render();
  }

  code_onClick(ev: MouseEvent){
    if(!this.applicationState.activeCompiledSprite)
      return;

    this.code = this.applicationState.activeCompiledSprite.toCode();
  }

  onCodeChanged(code: string){
    if(!!code){
      const sprite = CompiledSprite.fromCode(code);
      if(!!sprite){
        this.applicationState.compiledSprites.push(sprite);
        this.applicationState.activeCompiledSprite = sprite;
      }
    }

    this.code = null;
  }

  resetActiveAnimation(){
    if(!this.activeAnimation)
      return;

    if(!this.applicationState.activeCompiledSprite || this.applicationState.activeCompiledSprite.animations.indexOf(this.activeAnimation) < 0){
      this.activeAnimation = null;
    }
    this.resetFrame();
  }

  resetFrame(){
    this.activeFrame = 0;
  }
}
