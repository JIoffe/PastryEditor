import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ApplicationState } from 'src/services/application-state';

@Component({
  selector: 'app-vdp-registers',
  templateUrl: './vdp-registers.component.html',
  styleUrls: ['./vdp-registers.component.css']
})
export class VdpRegistersComponent implements OnInit {
  code: string = null;
  tooltip: '';

  //Mode Register 1
  colorMode = '9bit';
  hvCounter = 'disabled';
  hblank = 'disabled';

  //Mode Register 2
  vcellmode = 'vntsc';
  dma = 'enabled';
  vblank = 'enabled';

  //Mode register 3
  extint = "disabled"
  vscrollMode = "full"
  hscrollMode ="full"

  //Mode register 4
  hcellmode = 'h40';
  shadowhighlight = 'disabled';
  interlace = 'disabled';

  addressA = "C000";
  addressWindow = "10000";
  addressB = "E000";
  addressSprites = 'B800';
  addressHScroll = 'BC00';

  winHAlignment = 'left';
  winHPosition = 0;

  winVAlignment = 'top';
  winVPosition = 0;

  planesizeH="64"
  planesizeV="32"

  bgPalette = '0';
  bgColor = '0';

  hintcounter = 255;
  vdpautoincrement = 2;

  //DMA settings are not used on init
  //but are here for completeness
  dmaLength = 0xFFFF;
  dmaMode = 'ramtovram';
  dmaSource = 0;

  scrollPlaneValidAddresses = [
    0, 0x2000, 0x4000, 0x6000, 0x8000, 0xA000, 0xC000, 0xE000
  ]

  //In multiples of 0x200
  spriteValidAddresses = [0x0, 0x200, 0x400, 0x600, 0x800, 0xA00, 0xC00, 0xE00, 0x1000, 0x1200, 0x1400, 0x1600, 0x1800, 0x1A00, 0x1C00, 0x1E00, 0x2000, 0x2200, 0x2400, 0x2600, 0x2800, 0x2A00, 0x2C00, 0x2E00, 0x3000, 0x3200, 0x3400, 0x3600, 0x3800, 0x3A00, 0x3C00, 0x3E00, 0x4000, 0x4200, 0x4400, 0x4600, 0x4800, 0x4A00, 0x4C00, 0x4E00, 0x5000, 0x5200, 0x5400, 0x5600, 0x5800, 0x5A00, 0x5C00, 0x5E00, 0x6000, 0x6200, 0x6400, 0x6600, 0x6800, 0x6A00, 0x6C00, 0x6E00, 0x7000, 0x7200, 0x7400, 0x7600, 0x7800, 0x7A00, 0x7C00, 0x7E00, 0x8000, 0x8200, 0x8400, 0x8600, 0x8800, 0x8A00, 0x8C00, 0x8E00, 0x9000, 0x9200, 0x9400, 0x9600, 0x9800, 0x9A00, 0x9C00, 0x9E00, 0xA000, 0xA200, 0xA400, 0xA600, 0xA800, 0xAA00, 0xAC00, 0xAE00, 0xB000, 0xB200, 0xB400, 0xB600, 0xB800, 0xBA00, 0xBC00, 0xBE00, 0xC000, 0xC200, 0xC400, 0xC600, 0xC800, 0xCA00, 0xCC00, 0xCE00, 0xD000, 0xD200, 0xD400, 0xD600, 0xD800, 0xDA00, 0xDC00, 0xDE00, 0xE000, 0xE200, 0xE400, 0xE600, 0xE800, 0xEA00, 0xEC00, 0xEE00, 0xF000, 0xF200, 0xF400, 0xF600, 0xF800, 0xFA00, 0xFC00, 0xFE00]
  multiplesOf400 = [0x0, 0x400, 0x800, 0xC00, 0x1000, 0x1400, 0x1800, 0x1C00, 0x2000, 0x2400, 0x2800, 0x2C00, 0x3000, 0x3400, 0x3800, 0x3C00, 0x4000, 0x4400, 0x4800, 0x4C00, 0x5000, 0x5400, 0x5800, 0x5C00, 0x6000, 0x6400, 0x6800, 0x6C00, 0x7000, 0x7400, 0x7800, 0x7C00, 0x8000, 0x8400, 0x8800, 0x8C00, 0x9000, 0x9400, 0x9800, 0x9C00, 0xA000, 0xA400, 0xA800, 0xAC00, 0xB000, 0xB400, 0xB800, 0xBC00, 0xC000, 0xC400, 0xC800, 0xCC00, 0xD000, 0xD400, 0xD800, 0xDC00, 0xE000, 0xE400, 0xE800, 0xEC00, 0xF000, 0xF400, 0xF800, 0xFC00];

  get windowValidAddresses(){
    if(this.hcellmode === 'h40'){
      return [0, 0x1000, 0x2000, 0x3000, 0x4000, 0x5000, 0x6000, 0x7000, 0x8000, 0x9000, 0xA000, 0xB000, 0xC000, 0xD000, 0xE000, 0xF000]
    }else{
      return [0, 0x800, 0x1000, 0x1800, 0x2000, 0x2800, 0x3000, 0x3800, 0x4000, 0x4800, 0x5000, 0x5800, 0x6000, 0x6800, 0x7000, 0x7800, 0x8000, 0x8800, 0x9000, 0x9800, 0xA000, 0xA800, 0xB000, 0xB800, 0xC000, 0xC800, 0xD000, 0xD800, 0xE000, 0xE800, 0xF000, 0xF800]
    }
  }

  constructor(private applicationState: ApplicationState) { }

  ngOnInit() {
  }

  code_onClick(ev: MouseEvent){
    this.code = '; Send to vdp_command port at $C00004\r\nVDPSetupArray:\r\n'
      + ` dc.w  ${this.register0}       ;Color=${this.colorMode}, H/V=${this.hvCounter}, HBlank=${this.hblank}\r\n`
      + ` dc.w  ${this.register1}       ;Height=${this.vcellmode === 'vpal' ? 'V30 PAL' : 'V28 NTSC'}, DMA=${this.dma}, VBlank=${this.vblank}\r\n`
      + ` dc.w  ${this.register2}       ;PLANE A Address=${this.addressA}\r\n`
      + ` dc.w  ${this.register3}       ;WINDOW Address=${this.addressWindow}\r\n`
      + ` dc.w  ${this.register4}       ;PLANE B Address=${this.addressB}\r\n`
      + ` dc.w  ${this.register5}       ;SPRITE TABLE Address=${this.addressSprites}\r\n`
      + ` dc.w  ${this.register6}       ;(unused)\r\n`
      + ` dc.w  ${this.register7}       ;Backdrop Palette=${this.bgPalette}, Color=${this.bgColor}\r\n`
      + ` dc.w  ${this.register8}       ;(unused)\r\n`
      + ` dc.w  ${this.register9}       ;(unused)\r\n`
      + ` dc.w  ${this.register10}       ;H Interrupt Every ${this.hintcounter} lines\r\n`
      + ` dc.w  ${this.register11}       ;VSCROLL=${this.vscrollMode}, HSCROLL=${this.hscrollMode}, EXT. INT=${this.extint}\r\n`
      + ` dc.w  ${this.register12}       ;H Cells=${this.hcellmode}, SHADOW/HIGHLIGHT=${this.shadowhighlight}, Interlace=${this.interlace}\r\n`
      + ` dc.w  ${this.register13}       ;H Scroll Table Address=${this.addressHScroll}\r\n`
      + ` dc.w  ${this.register14}       ;(unused))\r\n`
      + ` dc.w  ${this.register15}       ;VDP Auto Increment ${this.vdpautoincrement} bytes\r\n`
      + ` dc.w  ${this.register16}       ;Scroll Plane Size=H${this.planesizeH} V${this.planesizeV} Cells\r\n`
      + ` dc.w  ${this.register17}       ;Window ${this.winHPosition} from ${this.winHAlignment}\r\n`
      + ` dc.w  ${this.register18}       ;Window ${this.winVPosition} from ${this.winVAlignment}\r\n`
      + ` dc.w  ${this.register19}       ;DMA Size=${this.dmaLength}\r\n`
      + ` dc.w  ${this.register20}       ;DMA Source=${this.dmaSource}\r\n`
      + ` dc.w  ${this.register21} \r\n`
      + ` dc.w  ${this.register22} \r\n`
      + ` dc.w  ${this.register23}       ;DMA Mode=${this.dmaMode}\r\n`;
  }

  onCodeChanged(code){
    this.code = null;
  }

  //Register printing
  get register0(){
    var hvCounterBit = this.hvCounter === 'enabled' ? 0x02 : 0;
    var colorBit = this.colorMode === '9bit' ? 0x04 : 0;
    var hblankBit = this.hblank === 'enabled' ? 0x10 : 0;
    return `$80${this.printByte(hvCounterBit, colorBit, hblankBit)}`;
  }

  get register1(){
    var vcellBit = this.vcellmode === 'vpal' ? 0x08 : 0;
    var dmaBit = this.dma === 'enabled' ? 0x10 : 0;
    let vblankBit = this.vblank === 'enabled' ? 0x20 : 0;

    return `$81${this.printByte(vcellBit, dmaBit, vblankBit, 0x44)}`;
  }

  get register2(){
    let bit = parseInt(this.addressA, 16) >> 10;
    return `$82${this.printByte(bit)}`;
  }

  get register3(){
    let bit = parseInt(this.addressWindow, 16) >> 10;
    return `$83${this.printByte(bit)}`;
  }

  get register4(){
    let bit = parseInt(this.addressB, 16) >> 13;
    return `$84${this.printByte(bit)}`;
  }

  get register5(){
    let bit = parseInt(this.addressSprites, 16) >> 9;
    return `$85${this.printByte(bit)}`;
  }

  get register6(){
    return '$8600';
  }

  get register7(){
    return `$87${this.bgPalette}${this.bgColor}`;
  }

  get register8(){
    return '$8800';
  }

  get register9(){
    return '$8900';
  }

  get register10(){
    return `$8A${this.printByte(this.hintcounter)}`
  }

  get register11(){
    let hscrollBit: number;
    switch(this.hscrollMode){
      case 'line':
        hscrollBit = 3;
        break;
      case 'cell':
        hscrollBit = 2;
        break;
      default:
        hscrollBit = 0;
        break;
    }
    let bits = [
      (this.extint === 'enabled' ? 0x08 : 0),
      (this.vscrollMode !== 'full' ? 0x04 : 0),
      hscrollBit
    ];
    return `$8B${this.printByte(...bits)}`;
  }

  get register12(){
    let interlaceBit: number;
    switch(this.interlace){
      case 'enabled':
          interlaceBit = 2;
        break;
      case 'double':
          interlaceBit = 6;
        break;
      default:
          interlaceBit = 0;
        break;
    }
    let bits = [
      (this.hcellmode === 'h40' ? 0x81 : 0),
      (this.shadowhighlight === 'enabled' ? 0x08 : 0),
      interlaceBit
    ];
    return `$8C${this.printByte(...bits)}`;
  }

  get register13(){
    let bit = parseInt(this.addressHScroll, 16) >> 10;
    return `$8D${this.printByte(bit)}`;
  }

  get register14(){
    return '$8E00';
  }

  get register15(){
    return `$8F${this.printByte(this.vdpautoincrement)}`;
  }

  get register16(){
    var getBit = v => {
      switch(v){
        case '32':
          return 0;
        case '64':
          return 1;
        case '128':
          return 3;
      }
    };
    var bits = [
      getBit(this.planesizeV) << 4,
      getBit(this.planesizeH)
    ];

    return `$90${this.printByte(...bits)}`;
  }

  get register17(){
    var bits = [
      this.winHAlignment === 'right' ? 0x80 : 0,
      this.winHPosition
    ];

    return `$91${this.printByte(...bits)}`;
  }

  get register18(){
    var bits = [
      this.winVAlignment === 'bottom' ? 0x80 : 0,
      this.winVPosition
    ];

    return `$92${this.printByte(...bits)}`;
  }

  get register19(){
    return `$93${this.printByte((this.dmaLength >> 1) & 0xFF)}`;
  }

  get register20(){
    return `$94${this.printByte(((this.dmaLength >> 1) & 0xFF00) >> 8) }`;
  }

  get register21(){
    return `$95${this.printByte((this.dmaSource >> 1) & 0xFF)}`;
  }

  get register22(){
    return `$96${this.printByte(((this.dmaSource >> 1) & 0xFF00) >> 8) }`;
  }

  get register23(){
    let dmaMode: number;

    switch(this.dmaMode){
      case 'vramtovram':
          dmaMode = 0x8C;
          break;
      case 'vramfill':
          dmaMode = 0x80;
          break;
      default:
          dmaMode = (this.dmaSource & 800000) >> 19;
          break;
    }

    var bits = [
      dmaMode,
      ((this.dmaSource >> 1) & 0x7F0000) >> 16
    ]
    return `$97${this.printByte(...bits)}`;
  }

  printByte(...bitMasks: number[]){
    let val = bitMasks.reduce((p, c) => p|c, 0).toString(16);
    if(val.length === 1){
      val = '0' + val;
    }

    return val.toUpperCase();
  }
}
