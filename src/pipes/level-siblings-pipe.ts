import { Pipe, PipeTransform } from '@angular/core';
import { ApplicationState } from 'src/services/application-state';
import { Level } from 'src/model/level';

@Pipe({
    name: 'levelSiblings',
    pure: false
})
export class LevelSiblingsPipe implements PipeTransform {
    constructor(private applicationState: ApplicationState){

    }

    transform(items: Level[]): any {
        if(!items || !items.length)
            return items;

        const siblings = items.filter(l => l != this.applicationState.activeLevel);
        return siblings;
    }
}