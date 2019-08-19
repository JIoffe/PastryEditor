import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-code-editor',
  templateUrl: './code-editor.component.html',
  styleUrls: ['./code-editor.component.css']
})
export class CodeEditorComponent implements OnInit {
  @Input() code: string;
  @Output() codeChanged = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
  }

  ok_click(ev: MouseEvent){
    this.codeChanged.emit(this.code);
  }

  cancel_click(ev: MouseEvent){
    this.codeChanged.emit(null);
  }
}
