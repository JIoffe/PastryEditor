import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Color } from 'src/model/color';

@Injectable({
    providedIn: 'root',
})
export class ApplicationState {
    PaletteObservable: Subject<Color[]> = new Subject();
    TileUpdatedObservable: Subject<Uint8Array> = new Subject();
}