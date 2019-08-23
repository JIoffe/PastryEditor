import { Subscription } from 'rxjs';
import { OnDestroy } from '@angular/core';

export abstract class BaseSubscriberComponent implements OnDestroy{
    protected subscriptions: Subscription[];

    protected subscribe(...subscriptions: Subscription[]){
        this.subscriptions = subscriptions;
    }

    ngOnDestroy(){
        if(!!this.subscriptions){
            this.subscriptions.forEach(s => s.unsubscribe());
        }
    }
}