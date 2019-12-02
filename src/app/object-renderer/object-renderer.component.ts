import { Component, OnInit, ViewChild, ElementRef, Input, OnChanges } from '@angular/core';
import { Item } from 'src/model/item';
import { ItemTypes, ItemDimensions } from 'src/assets/item-definitions/baolongtu-items';

@Component({
  selector: 'app-object-renderer',
  templateUrl: './object-renderer.component.html',
  styleUrls: ['./object-renderer.component.css']
})
export class ObjectRendererComponent implements OnInit, OnChanges {
  @Input() item: Item;
  @Input() zoom: number = 100;

  imgs: ObjectImage[] = [];
  constructor() { }

  ngOnInit() {
    this.render();
  }

  ngOnChanges(){
    this.render();
  }

  render(){
    this.imgs = [];

    if(!this.item)
      return;

    switch(this.item.type){
      case ItemTypes.GemHorizontal:
        for(let i = 0; i < 7; ++i){
          if(this.item.state & (Math.pow(2, i))){
            this.imgs.push({
              src: '/assets/images/ruby.png',
              x: this.zoom * i * 0.01 * ItemDimensions.GemSpacingH,
              y: 0,
              width: this.zoom * 0.01 * ItemDimensions.GemWidth,
              height: this.zoom * 0.01 * ItemDimensions.GemHeight
            });
          }
        }
        return;
      case ItemTypes.GemVertical:
          for(let i = 0; i < 7; ++i){
            if(this.item.state & (Math.pow(2, i))){
              this.imgs.push({
                src: '/assets/images/ruby.png',
                x: 0,
                y: this.zoom * i * 0.01 * ItemDimensions.GemSpacingV,
                width: this.zoom * 0.01 * ItemDimensions.GemWidth,
                height: this.zoom * 0.01 * ItemDimensions.GemHeight
              });
            }
          }
          return;
      default:
        return;
    }
  }
}

interface ObjectImage{
  x: number;
  y: number;
  src: string;
  width: number;
  height: number;
}