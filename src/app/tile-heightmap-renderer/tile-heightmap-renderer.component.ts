import { Component, OnInit, ViewChild, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';
import { BaseSubscriberComponent } from '../base-subscriber.component';
import { ApplicationState } from 'src/services/application-state';

@Component({
  selector: 'app-tile-heightmap-renderer',
  templateUrl: './tile-heightmap-renderer.component.html',
  styleUrls: ['./tile-heightmap-renderer.component.css']
})
export class TileHeightmapRendererComponent extends BaseSubscriberComponent implements OnInit, OnChanges {
  @ViewChild('canvas', null) canvas:ElementRef;
  @Input() width: number = 64;
  @Input() height: number = 64;
  @Input() heightmap: Uint8Array;

  @Input() bgColor: string = 'green';
  @Input() fgColor: string = '#FFF';
  
  constructor(private applicationState: ApplicationState) {
    super();
   }

  ngOnInit(): void {
    this.redraw();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.redraw();
  }

  private redraw(){
    const canvas = this.canvas.nativeElement;
    canvas.setAttribute('width', this.width + '');
    canvas.setAttribute('height', this.height + '');

    const ctx = canvas.getContext('2d');

    ctx.fillStyle = this.bgColor;
    ctx.fillRect(0,0,this.width,this.height);

    const columnWidth = Math.floor(this.width / this.heightmap.length),
          scale       = this.height / 8;
    ctx.fillStyle = this.fgColor;

    for(let i = 0; i < this.heightmap.length; ++i){
      ctx.fillRect(i * columnWidth, Math.floor(this.height - this.heightmap[i] * scale), columnWidth, this.heightmap[i] * scale);
    }
  }
}
