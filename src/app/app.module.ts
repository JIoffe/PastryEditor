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
import { TilePageComponent } from './tile-page/tile-page.component';
import { RouterModule, Routes } from '@angular/router';
import { TileStampPageComponent } from './tile-stamp-page/tile-stamp-page.component';
import { TileStampLibraryComponent } from './tile-stamp-library/tile-stamp-library.component';
import { StampEditorComponent } from './stamp-editor/stamp-editor.component';

const appRoutes: Routes = [
  { path: 'edit-tiles', component: TilePageComponent },
  { path: 'edit-tile-stamps', component: TileStampPageComponent },
  { path: '**', component: TilePageComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    ColorPickerComponent,
    ColorSliderComponent,
    PaletteLibraryComponent,
    CodeEditorComponent,
    TileLibraryComponent,
    TileEditorComponent,
    TilePageComponent,
    TileStampPageComponent,
    TileStampLibraryComponent,
    StampEditorComponent
  ],
  imports: [
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    ),
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
