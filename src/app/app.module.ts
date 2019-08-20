import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ColorPickerComponent } from './color-picker/color-picker.component';
import { ColorSliderComponent } from './color-slider/color-slider.component';
import { PaletteLibraryComponent } from './palette-library/palette-library.component';
import { CodeEditorComponent } from './code-editor/code-editor.component';
import { TileLibraryComponent } from './tile-library/tile-library.component';
import { TileEditorComponent } from './tile-editor/tile-editor.component';

@NgModule({
  declarations: [
    AppComponent,
    ColorPickerComponent,
    ColorSliderComponent,
    PaletteLibraryComponent,
    CodeEditorComponent,
    TileLibraryComponent,
    TileEditorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
