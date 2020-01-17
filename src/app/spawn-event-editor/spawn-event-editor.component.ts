import { Component, OnInit } from '@angular/core';
import { FormattingUtils } from 'src/utils/formatting-utils';

@Component({
  selector: 'app-spawn-event-editor',
  templateUrl: './spawn-event-editor.component.html',
  styleUrls: ['./spawn-event-editor.component.css']
})
export class SpawnEventEditorComponent implements OnInit {
  timelineLength = 1800;
  timelineInterval = 10;

  timeline: SpawnEntry[][];

  code: string = null;

  cursorEventType: number = 0;
  cursorX: number = 0;

  previewKeyframe: SpawnEntry[] = null;

  constructor() { }

  ngOnInit() {
    this.rebuildTimeline();
  }

  rebuildTimeline(){
    this.timeline = new Array(this.timelineLength);
    for(let i = 0; i < this.timelineLength; ++i){
      this.timeline[i] = [];
    }
  }

  keyframeOnClick(ev: MouseEvent, keyframe: SpawnEntry[]){
    keyframe.push({
      type: this.cursorEventType,
      position: ev.offsetX - (ev.offsetX & 15)
    });
  }

  keyframeOnHover(ev: MouseEvent, keyframe: SpawnEntry[]){
    const el:any = ev.target,
          rect = el.getBoundingClientRect();

    const rawX = ev.pageX - rect.left;
    this.cursorX = rawX - (rawX & 15);
    this.previewKeyframe = keyframe;
  }

  clearKeyframe(keyframe: SpawnEntry[]){
    keyframe.length = 0;
  }

  code_onClick(ev){
    let code = '';
    this.timeline.forEach((keyframe, i) => {
      if(!keyframe.length)
        return;

      code += ` dc.w  ${i}  ; KEYFRAME\r\n`
            + `   dc.w  ${keyframe.length-1} ; (n-1) items\r\n`;
      keyframe.forEach(spawn => {
        code  += `    dc.w  $${FormattingUtils.padByte(spawn.type)}${FormattingUtils.padByte((spawn.position+0x80)>>1)}\r\n`
      });
    });

    code += ' ; END\r\n dc.w $FFFF\r\n';

    this.code = code;
  }

  onCodeChanged(code){
    this.rebuildTimeline();
    if(!!code && !!code.length){
      var lines = code.match(/dc\.w\s+\$?[0-9a-fA-F]+/g);
      let i = 0;
      while(i < lines.length){
        if(lines[i].indexOf('$FFFF') >= 0)
          break;

        let frame = +lines[i++].split(/\s+/)[1];

        let keyframe = this.timeline[frame];
        let count = +lines[i++].split(/\s+/)[1] + 1;
        for(let j = 0; j < count; ++j){
          let value = lines[i++].split(/\s+/)[1];
          keyframe.push({
            position: parseInt(value.substr(3,4),16) * 2 - 0x80,
            type: parseInt(value.substr(1,2),16)
          })
        }
      }
    }
    this.code = null;
  }
}

interface SpawnEntry{
  type: number,
  position: number
}