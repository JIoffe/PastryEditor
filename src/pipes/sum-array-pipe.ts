import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'sum'
})
export class SumPipe implements PipeTransform{
    transform(value: number[]){
        if(!value || !value.length)
            return 0;
            
        return value.reduce((p,c) => p + c, 0);
    }
}