import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { Source } from 'data/Sources';
import { TimeSeries } from 'data/Types/TimeSeries';

import { Collator } from './Collator';
import { Collector } from './Collector';
import { Data } from './Data';
import { Domain } from './Domain';
import { Evictor } from './Evictor';

export class Collection<T, U extends TimeSeries<T>> {
    constructor(domain: Domain, collator: Collator<T,U>, evictor: Evictor<T,U>) {
        this._domain = domain;
        this._collator = collator;
        this._evictor = evictor;

        this._collectors = new BehaviorSubject([]);
        this.data = this._data = new BehaviorSubject([]);
        this.gatherDataFromCollectors();
    }

    private readonly _domain: Domain;
    private readonly _collator: Collator<T,U>;
    private readonly _evictor: Evictor<T,U>;
    private readonly _collectors: BehaviorSubject<Collector<T,U>[]>;
    private readonly _data: BehaviorSubject<Data<T,U>[]>;

    private gatherDataFromCollectors(): void {
        this._collectors.pipe(
            map(_ => _.map(_ => _.data)),
            switchMap(_ => combineLatest(_)),
            map(_ => _.flat()),
        ).subscribe(this._data);
    }

    readonly data: Observable<Data<T,U>[]>;

    addSource(source: Source<T,U>): void {
        const collector = new Collector(this._domain, source, this._collator, this._evictor);
        const collectors = this._collectors.value.concat(collector);
        this._collectors.next(collectors);
    }

    removeSource(source: Source<T,U>): void {
        const collector = this._collectors.value.find(_ => _.source === source);
        collector?.stop();
        const collectors = this._collectors.value.filter(_ => _ !== collector);
        this._collectors.next(collectors);
    }
}