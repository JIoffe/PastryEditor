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
import { DrawColorSelectorComponent } from './draw-color-selector/draw-color-selector.component';
import { OptionsPageComponent } from './options-page/options-page.component';
import { TraceImageSelectorComponent } from './trace-image-selector/trace-image-selector.component';
import { ImageImporterComponent } from './image-importer/image-importer.component';
import { VdpPageComponent } from './vdp-page/vdp-page.component';
import { VdpRegistersComponent } from './vdp-registers/vdp-registers.component';
import { SpritePageComponent } from './sprite-page/sprite-page.component';
import { SpriteLibraryComponent } from './sprite-library/sprite-library.component';
import { BlockElementPreviewComponent } from './block-element-preview/block-element-preview.component';
import { MultiTileEditorComponent } from './multi-tile-editor/multi-tile-editor.component';
import { DrawToolSelectorComponent } from './draw-tool-selector/draw-tool-selector.component';
import { LevelPageComponent } from './level-page/level-page.component';
import { LevelEditorComponent } from './level-editor/level-editor.component';
import { LevelLibraryComponent } from './level-library/level-library.component';
import { LevelEditModeComponent } from './level-edit-mode/level-edit-mode.component';
import { SpriteGroupPageComponent } from './sprite-group-page/sprite-group-page.component';
import { SpriteGroupLibraryComponent } from './sprite-group-library/sprite-group-library.component';

const appRoutes: Routes = [
  { path: 'edit-tiles', component: TilePageComponent },
  { path: 'edit-tile-stamps', component: TileStampPageComponent },
  { path: 'edit-sprites', component: SpritePageComponent},
  { path: 'edit-sprite-groups', component: SpriteGroupPageComponent},
  { path: 'edit-level', component: LevelPageComponent },
  { path: 'options', component: OptionsPageComponent },
  { path: 'vdp', component: VdpPageComponent},
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
    DrawColorSelectorComponent,
    OptionsPageComponent,
    TraceImageSelectorComponent,
    ImageImporterComponent,
    VdpPageComponent,
    VdpRegistersComponent,
    SpritePageComponent,
    SpriteLibraryComponent,
    BlockElementPreviewComponent,
    MultiTileEditorComponent,
    DrawToolSelectorComponent,
    LevelPageComponent,
    LevelEditorComponent,
    LevelLibraryComponent,
    LevelEditModeComponent,
    SpriteGroupPageComponent,
    SpriteGroupLibraryComponent
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
