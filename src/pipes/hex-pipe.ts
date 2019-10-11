import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'toHex'
})
export class HexPipe implements PipeTransform{
    transform(value: number){
        return '$' + (value||0).toString(16).toUpperCase();
    }
}