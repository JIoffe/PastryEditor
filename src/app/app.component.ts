import { Component } from '@angular/core';
import { Color } from 'src/model/color';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  showColorPicker = false;
  title = 'Pastry';

  onColorSelected(color: Color) {
    this.showColorPicker = false;
  }
}
