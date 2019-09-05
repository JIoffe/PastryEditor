import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-block-element-preview',
  templateUrl: './block-element-preview.component.html',
  styleUrls: ['./block-element-preview.component.css']
})
export class BlockElementPreviewComponent implements OnInit {
  @Input() title: string = "Preview";
  @Input() min: number = 1;
  @Input() max: number = 4;

  width: number;
  height: number;

  @Output() sizeSelected = new EventEmitter<number[]>();

  constructor() { }

  ngOnInit() {
    this.width = this.min;
    this.height = this.min;
  }

  ok(ev: MouseEvent){
    this.sizeSelected.emit([this.width, this.height]);
  }

  cancel(ev: MouseEvent){
    this.sizeSelected.emit(null);
  }
}
