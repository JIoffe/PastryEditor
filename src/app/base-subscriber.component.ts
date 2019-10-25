import { Subscription, Subject } from 'rxjs';
import { OnDestroy } from '@angular/core';

export abstract class BaseSubscriberComponent implements OnDestroy{
    protected subscriptions: Subscription[];
    protected $destruction: Subject<void> = new Subject();

    protected subscribe(...subscriptions: Subscription[]){
        this.subscriptions = subscriptions;
    }

    ngOnDestroy(){
        if(!!this.subscriptions){
            this.subscriptions.forEach(s => s.unsubscribe());
        }
        
        this.$destruction.next();
        this.$destruction.complete();
        this.$destruction = null;
    }
}