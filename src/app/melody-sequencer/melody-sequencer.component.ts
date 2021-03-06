import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormattingUtils } from 'src/utils/formatting-utils';


const notes = [
  {
    label: 'D#6',
    freq: 1244.51
  },
  {
    label: 'D6',
    freq: 1174.66
  },
  {
    label: 'C#6',
    freq: 1108.73
  },
  {
    label: 'C6',
    freq: 1046.50
  },
  {
    label: 'B5',
    freq: 987.77
  },
  {
    label: 'A#5',
    freq: 932.33
  },
  {
    label: 'A5',
    freq: 880.0
  },
  {
    label: 'G#5',
    freq: 830.61
  },
  {
    label: 'G5',
    freq: 783.99
  },
  {
    label: 'F#5',
    freq: 739.99
  },
  {
    label: 'F5',
    freq: 698.46
  },
  {
    label: 'E5',
    freq: 659.25
  },
  {
    label: 'D#5',
    freq: 622.25
  },
  {
    label: 'D5',
    freq: 587.33
  },
  {
    label: 'C#5',
    freq: 554.37
  },
  {
    label: 'C5',
    freq: 523.25
  },
  {
    label: 'B4',
    freq: 493.88
  },
  {
    label: 'A#4',
    freq: 466.16
  },
  {
    label: 'A4',
    freq: 440.0
  },
  {
    label: 'G#4',
    freq: 415.30
  },
  {
    label: 'G4',
    freq: 392.00
  },
  {
    label: 'F#4',
    freq: 369.99
  },
  {
    label: 'F4',
    freq: 349.23
  },
  {
    label: 'E4',
    freq: 329.63
  },
  {
    label: 'D#4',
    freq: 311.13
  },
  {
    label: 'D4',
    freq: 293.66
  },
  {
    label: 'C#4',
    freq: 277.18
  },
  {
    label: 'C4',
    freq: 261.63
  },
  {
    label: 'B3',
    freq: 246.94
  },
  {
    label: 'A#3',
    freq: 233.08
  },
  {
    label: 'A3',
    freq: 220.0
  },
  {
    label: 'G#3',
    freq: 207.65
  },
  {
    label: 'G3',
    freq: 196.00
  },
  {
    label: 'F#3',
    freq: 185.00
  },
  {
    label: 'F3',
    freq: 174.61
  },
  {
    label: 'E3',
    freq: 164.81
  },
  {
    label: 'D#3',
    freq: 155.56
  },
  {
    label: 'D3',
    freq: 146.83
  },
  {
    label: 'C#3',
    freq: 138.59
  },
  {
    label: 'C3',
    freq: 130.81
  },
  {
    label: 'B2',
    freq: 123.47
  },
  {
    label: 'A#2',
    freq: 116.54
  },
  {
    label: 'A2',
    freq: 110.00
  },
  {
    label: 'G#2',
    freq: 103.83
  },
  {
    label: 'G2',
    freq: 98.00
  },
  {
    label: 'F#2',
    freq: 92.50
  },
  {
    label: 'F2',
    freq: 87.31
  },
  {
    label: 'E2',
    freq: 82.41
  },
  {
    label: 'D#2',
    freq: 77.78
  },
  {
    label: 'D2',
    freq: 73.42
  },
  {
    label: 'C#2',
    freq: 69.30
  },
  {
    label: 'C2',
    freq: 65.41
  },
];

interface MelodyNote{
  startTime: number,
  length: number,
  channels: Int32Array,
  channelVolumes: Int32Array
}

function startOscillator(oscillator){
  if(!!oscillator.start){
    oscillator.start(0);
  }else{
    oscillator.noteOn(0);
  }
}

function stopOscillator(oscillator){
  if(!!oscillator.stop){
    oscillator.stop(0);
  }else{
    oscillator.noteOff(0);
  }
}

@Component({
  selector: 'app-melody-sequencer',
  templateUrl: './melody-sequencer.component.html',
  styleUrls: ['./melody-sequencer.component.css']
})
export class MelodySequencerComponent implements OnInit {
  @ViewChild('contentContainer', null) contentContainer:ElementRef;
  @ViewChild('sequencerTable', null) sequencerTable:ElementRef;

  _notes = notes;
  tempo: number = 120;
  measuresToShow: number = 20;

  measureCopyStart: number = 0;
  measureCopyEnd: number = 0;
  measureCopyDest: number = 0;

  melody: MelodyNote[] = [];

  code: string = null;

  trackerPos: number = -1;

  activeNote: MelodyNote = null;

  channelOscillators: any[];

  channelsToPlay: boolean[] = [true,true,true,true];

  get measuresRange(){
    return new Array(this.measuresToShow);
  }

  channelSelection: number = 0;
  noteVolumeSelection: number =  0xF;
  noteLengthSelection: number = 1;

  playMelodyInterval: any = null;

  constructor() { }

  ngOnInit() {

  }

  createSquareWaveOscillator(ctx){
    var oscillator = ctx.createOscillator();
    oscillator.type = 'square'; 
    const gainNode = !!ctx.createGainNote ? ctx.createGainNode() : ctx.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    return [oscillator, gainNode];
  }

  playNotePreview(freq, volume){
    //@ts-ignore
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioContext();

    const osc = this.createSquareWaveOscillator(ctx);
    osc[0].frequency.value = freq;
    osc[1].gain.value = volume;

    startOscillator(osc[0]);

    setInterval(() => {
      stopOscillator(osc[0]);
      osc[0].disconnect();
    }, 250);
  }

  stopMelody(){
    if(!!this.playMelodyInterval){
      clearTimeout(this.playMelodyInterval);
    }

    if(!!this.channelOscillators){
      this.channelOscillators.forEach(o => stopOscillator(o[0]));

      this.channelOscillators[0][0].disconnect();
      this.channelOscillators[1][0].disconnect();
      this.channelOscillators[2][0].disconnect();

      this.channelOscillators = null;
    }

    this.activeNote = null;
    this.trackerPos = -1;
  }

  playMelody(){
    if(!!this.playMelodyInterval){
      clearTimeout(this.playMelodyInterval);
    }

    //@ts-ignore
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioContext();

    this.channelOscillators = [
      this.createSquareWaveOscillator(ctx),this.createSquareWaveOscillator(ctx),this.createSquareWaveOscillator(ctx)
    ];
    var channelOscillators = this.channelOscillators;

    channelOscillators.forEach(o => {
      o[1].gain.value = 0;
      startOscillator(o[0]);
    });

    let tempoAccumulator = 0;
    let trackerTime = 0;

    this.trackerPos = 0;
    const _this = this;
    (function playMelodyLoop(){
      _this.activeNote = _this.melody.find(n => {
        let trackerPosStart = _this.trackerPos >> 5;
        return n.startTime <= trackerPosStart && (n.startTime + n.length) > trackerPosStart;
      });
      if(!!_this.activeNote){
        for(let i = 0; i < 3; ++i){
          if(_this.activeNote.channels[i] > -1 && _this.channelsToPlay[i]){
            channelOscillators[i][0].frequency.value = notes[_this.activeNote.channels[i]].freq;
            channelOscillators[i][1].gain.value = _this.activeNote.channelVolumes[i] / 15;
          }else{
            channelOscillators[i][1].gain.value = 0;
          }
        }      
      }else{
        for(let i = 0; i < 3; ++i){
          channelOscillators[i][1].gain.value = 0;
        }      
      }


      //Adjust for tempo
      //8th note duration = 60000 / (2*_this.tempo);
      let pixelDuration = 60000 / (_this.tempo << 6);
      _this.trackerPos += 32 / pixelDuration;
      

      // tempoAccumulator += (_this.tempo >> 2);
      // if(tempoAccumulator > 0xFF){
      //   tempoAccumulator = tempoAccumulator - 0xFF;
      //   trackerTime++;
      // }
      _this.playMelodyInterval = setTimeout(playMelodyLoop, 32);
    })();
  }

  //Returns a 10-bit value to feed the PSG
  getPSGFreqConversion(freq, channel){
    let value = Math.floor(3580000 /(32*freq));

    if(channel === 3)
      return `%${FormattingUtils.padByteBinary(0b11100000|(value&0b00001111))}`;

    const channelMask = channel << 5;
      return `%${FormattingUtils.padByteBinary(channelMask|0b10000000|(value&0b00001111))},%${FormattingUtils.padByteBinary((value>>4)&0b00111111)}`;
  }

  copyMeasures(){
    let nodesToCopy: MelodyNote[] = this.melody.filter(node => {
      let measure = Math.floor(node.startTime / 8);
      return measure >= this.measureCopyStart && measure <= this.measureCopyEnd;
    });

    // let offset = this.melody.map(n => n.startTime).reduce((p,c) => Math.max(p, c), 0);
    // offset += 256 - (offset % 256);
    let offset = 8 * (this.measureCopyDest - this.measureCopyStart);

    nodesToCopy = nodesToCopy.map(n => {
      return {
        startTime: n.startTime + offset,
        length: n.length,
        channelVolumes: new Int32Array(n.channelVolumes),
        channels: new Int32Array(n.channels)
      }
    });

    this.melody = this.melody.concat(...nodesToCopy);
  }

  sequencerClick(ev: MouseEvent){
    const content = this.contentContainer.nativeElement,
          contentRect = content.getBoundingClientRect(),
          table = this.sequencerTable.nativeElement,
          tableRect = table.getBoundingClientRect();

    let noteIndex = Math.min(notes.length-1,Math.floor((ev.pageY - tableRect.top) / 24));
    const note = notes[noteIndex];

    let startTime = Math.floor((ev.pageX - tableRect.left) >> 5);
    
    let entry: MelodyNote = this.melody.find(m => m.startTime === startTime);
    if(!entry){
      entry = {
        startTime: startTime,
        length: this.noteLengthSelection,
        channels: new Int32Array(4).fill(-1),
        channelVolumes: new Int32Array(4).fill(0)
      }
      this.melody.push(entry);
    }else{
      if(entry.channels[this.channelSelection] === noteIndex){
        entry.channels[this.channelSelection] = -1;
        if(entry.channels[0] === -1 && entry.channels[1] === -1 && entry.channels[2] === -1 && entry.channels[3] === -1){
          this.melody.splice(this.melody.indexOf(entry), 1);
        }
        return;
      }
    }

    this.playNotePreview(note.freq, this.noteVolumeSelection / 15);

    entry.channels[this.channelSelection] = noteIndex;
    entry.channelVolumes[this.channelSelection] = this.noteVolumeSelection;
  }

  code_onClick(ev: MouseEvent){
    //     ; For each note:
    // ; 1 byte for the delay
    // ; 4 bytes for channel volumes
    // ; 6 bytes for tone channel freq
    // ; 1 byte for noise channel freq
    // ; a delay of 0 means the melody is over
    let code = `;TEMPO ${this.tempo}\r\n`;
    const melodyToExport = this.melody
      .filter(n => n.channels[0] >= 0 || n.channels[1] >= 0 || n.channels[2] >= 0 || n.channels[3] >= 0)
      .sort((a,b) => a.startTime-b.startTime);

    if(melodyToExport.length === 0){
      this.code = code;
      return;
    }

    //A bit silly, but insert a rest at the end of the last measure
    const lastNote = melodyToExport[melodyToExport.length - 1];
    const restStart = (((lastNote.startTime >> 3) + 1) << 3);

    melodyToExport.push({
      startTime: restStart,
      channelVolumes: new Int32Array([0,0,0,0]),
      length: 0,
      channels: new Int32Array(lastNote.channels)
    })

    melodyToExport.forEach((node, i) => {
      const channelVolumes = [
        
        node.channels[0] >= 0 ? '%'+FormattingUtils.padByteBinary(0b10010000|(15 - node.channelVolumes[0])) : '%10011111',
        node.channels[1] >= 0 ? '%'+FormattingUtils.padByteBinary(0b10110000|(15 - node.channelVolumes[1])) : '%10111111',
        node.channels[2] >= 0 ? '%'+FormattingUtils.padByteBinary(0b11010000|(15 - node.channelVolumes[2])) : '%11011111',
        node.channels[3] >= 0 ? '%'+FormattingUtils.padByteBinary(0b11110000|(15 - node.channelVolumes[3])) : '%11111111',
      ];

      //const startTime = Math.floor((node.startTime)*(60/this.tempo)) || 1;
      const startTime = i === 0 ? node.startTime : node.startTime - melodyToExport[i-1].startTime;

      const channelFrequencies = [
        this.getPSGFreqConversion((notes[node.channels[0]]||notes[0]).freq, 0),
        this.getPSGFreqConversion((notes[node.channels[1]]||notes[0]).freq, 1),
        this.getPSGFreqConversion((notes[node.channels[2]]||notes[0]).freq, 2),
        this.getPSGFreqConversion((notes[node.channels[3]]||notes[0]).freq, 3)
      ]
      code += ` db  ${startTime},${node.length},${channelVolumes[0]},${channelVolumes[1]},${channelVolumes[2]},${channelVolumes[3]}\r\n`+
              ` db    ${channelFrequencies[0]},${channelFrequencies[1]},${channelFrequencies[2]},${channelFrequencies[3]}\r\n`

    });

    code +=   ' db  0 ;END\r\n';

    this.code = code;
  }

  onCodeChanged(code: string){
    if(!!code){
      this.melody = [];

      const lines = code.split(/db/g);
      this.tempo = +lines[0].substr(7);

      let i = 1;
      let offset = 0;
      while(i < lines.length){
        if(lines[i].indexOf(';END') >= 0)
          break;

        if(!lines[i].trim().length){
          ++i;
          continue;
        }
        
        let timingAndVolumes = lines[i++].split(/[,\r\n]/g);
        let timing = +timingAndVolumes[0].trim();

        let startTime = timing + offset;
        offset += timing;

        let channelVolumes = [
          15 - parseInt(timingAndVolumes[2].substr(5), 2),
          15 - parseInt(timingAndVolumes[3].substr(5), 2),
          15 - parseInt(timingAndVolumes[4].substr(5), 2),
          15 - parseInt(timingAndVolumes[5].substr(5), 2)
        ];

        let frequencies = lines[i++].split(/[,\r\n]/g);
        let channel0 = parseInt(frequencies[0].trim().substr(5), 2)|(parseInt(frequencies[1].trim().substr(3), 2) << 4);
        let channel1 = parseInt(frequencies[2].trim().substr(5), 2)|(parseInt(frequencies[3].trim().substr(3), 2) << 4);
        let channel2 = parseInt(frequencies[4].trim().substr(5), 2)|(parseInt(frequencies[5].trim().substr(3), 2) << 4);
        let channel3 = parseInt(frequencies[6].trim().substr(5), 2);

        let channels = [channel0,channel1,channel2,channel3]
          .map((c, i) => {
            let index: number ;
            if(i === 3){
              //Noise is different because it only has one latch
              index = notes.findIndex(n => c === (Math.floor(3580000 /(32*n.freq)) & 0x0F) );
            }else{
              index = notes.findIndex(n => c === Math.floor(3580000 /(32*n.freq)));
            }
            if(channelVolumes[i] === 0 && index === 0)
              return -1;
      
            return index;
          });

        const noteLength = +timingAndVolumes[1];

        if(noteLength > 0){
          this.melody.push({
            startTime: startTime,
            length: +timingAndVolumes[1],
            channelVolumes: new Int32Array(channelVolumes),
            channels: new Int32Array(channels)
          });
        }
      }
    }
    this.code = null;
  }

  printRest(startTime){
    return  ` db  ${startTime},%10011111,%10111111,%11011111,%11111111\r\n`+
            ` db    %10000000,%00000000,%10100000,%00000000,%11000000,%00000000,%11100000 \r\n`
  }
}
