import { Component } from '@angular/core';
import { ApplicationState } from 'src/services/application-state';
import { MemoryMapEntry } from 'src/model/memory-map-entry';

const constantSpacing = 32;

@Component({
  selector: 'app-memory-map',
  templateUrl: './memory-map.component.html',
  styleUrls: ['./memory-map.component.css']
})
export class MemoryMapComponent {
  memoryStart = 0xFFFF0000;
  code = null;
  
  constructor(private applicationState:ApplicationState) { }

  memoryStartChanged(ev: string){
    this.memoryStart = parseInt(ev.replace(/\s*((\$)|(0x))\s*/g, ''), 16);
  }

  memoryMapAdd(ev: MouseEvent){
    let address: number;
    if(!!this.applicationState.memoryMap.length){
      let lastEntry = this.applicationState.memoryMap[this.applicationState.memoryMap.length - 1];
      address = lastEntry.address + lastEntry.size;
    }else{
      address = this.memoryStart;
    }

    this.applicationState.memoryMap.push({
      label: 'MEM_' + this.applicationState.memoryMap.length,
      description: '',
      size: 1,
      address: address
    });
  }

  memoryMapRemove(ev: MouseEvent, i: number){
    if(i >= this.applicationState.memoryMap.length)
      return;

    let removedElement = this.applicationState.memoryMap.splice(i, 1)[0];
    while(i <= this.applicationState.memoryMap.length){
      this.applicationState.memoryMap[i++].address -= removedElement.size;
    }
  }

  code_onClick(ev: MouseEvent){
    const sizeComments = ['(additional alias)', 'BYTE', 'WORD', null, 'LONG'];

    let code = '';
    this.applicationState.memoryMap.forEach(entry => {
      code += entry.label.padEnd(constantSpacing, ' ');
      code += 'EQU $' + entry.address.toString(16).toUpperCase();
      code += (';' + sizeComments[entry.size]).padStart(12, ' ');
      code += '\r\n';
    });

    this.code = code;
  }

  moveUpClick(entry: MemoryMapEntry, i: number){
    if(i === 0)
      return;

    var temp = this.applicationState.memoryMap[i - 1];
    this.applicationState.memoryMap[i - 1] = this.applicationState.memoryMap[i];
    this.applicationState.memoryMap[i] = temp;

    this.onSizeChanged(0, this.applicationState.memoryMap[0].size);
  }

  moveDownClick(entry: MemoryMapEntry, i: number){
    if(i >= this.applicationState.memoryMap.length - 1)
      return;

    var temp = this.applicationState.memoryMap[i + 1];
    this.applicationState.memoryMap[i + 1] = this.applicationState.memoryMap[i];
    this.applicationState.memoryMap[i] = temp;

    this.onSizeChanged(0, this.applicationState.memoryMap[0].size);
  }

  onCodeChanged(code: string){
    if(!!code){
      this.applicationState.memoryMap = code
        .split(/[\r\n]+/g)
        .filter(line => !!line.trim().length)
        .map(line => {
          const label = line.match(/(^.*)(EQU)/i)[1].trim();
          return {
            label: label,
            description: '',
            size: 1,
            address: parseInt(line.match(/[a-f0-9]{8}/i)[0], 16)
          }
        });

      for(let i = this.applicationState.memoryMap.length - 2; i >= 0; --i){
        let current = this.applicationState.memoryMap[i],
            next = this.applicationState.memoryMap[i + 1];

        current.size = next.address - current.address;
      }

      if(!!this.applicationState.memoryMap.length)
        this.memoryStart = this.applicationState.memoryMap[0].address;
      else
        this.memoryStart = 0xFFFF0000;
    }
    this.code = null;
  }

  onSizeChanged(i: number, size: number){
    let offset = this.applicationState.memoryMap[i++].address + size;
    while(i < this.applicationState.memoryMap.length){
      let entry = this.applicationState.memoryMap[i++];
      entry.address = offset;
      offset += entry.size;
    }
  }
}
