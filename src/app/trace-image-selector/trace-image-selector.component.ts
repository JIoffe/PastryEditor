import { Component, OnInit } from '@angular/core';
import { ApplicationState } from 'src/services/application-state';

@Component({
  selector: 'app-trace-image-selector',
  templateUrl: './trace-image-selector.component.html',
  styleUrls: ['./trace-image-selector.component.css']
})
export class TraceImageSelectorComponent implements OnInit {
  showImageSelection = false;

  constructor(private applicationState: ApplicationState) { }

  ngOnInit() {
    // document.getElementById('pasteArea').onpaste = function (event) {
    //   // use event.originalEvent.clipboard for newer chrome versions
    //   var items = (event.clipboardData  || event.originalEvent.clipboardData).items;
    //   console.log(JSON.stringify(items)); // will give you the mime types
    //   // find pasted image among pasted items
    //   var blob = null;
    //   for (var i = 0; i < items.length; i++) {
    //     if (items[i].type.indexOf("image") === 0) {
    //       blob = items[i].getAsFile();
    //     }
    //   }
    //   // load image if there is a pasted image
    //   if (blob !== null) {
    //     var reader = new FileReader();
    //     reader.onload = function(event) {
    //       console.log(event.target.result); // data url!
    //       document.getElementById("pastedImage").src = event.target.result;
    //     };
    //     reader.readAsDataURL(blob);
    //   }
    // }
  }

  selectImage_click(ev: MouseEvent){
    this.showImageSelection = true;
  }

  cancel_click(ev: MouseEvent){
    this.showImageSelection = false;
  }

  onImagePaste(ev: ClipboardEvent){
    let url = ev.clipboardData.getData("text/plain");
    if(!!url && !!url.length){
      this.applicationState.traceImage = url;
    }

    this.showImageSelection = false;
  }
}
