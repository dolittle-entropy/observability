import moment from 'moment';
import { BehaviorSubject, concat, from, Observable, Subscription } from 'rxjs';
import { exhaustMap, map, scan, switchMap } from 'rxjs/operators';

import { hasStreamingCapabilitiles, PollingSource, Response, Source, StreamingSource } from 'data/Sources';
import { AbsoluteDomain, RelativeDomain } from 'data/Types/Domain';
import { TimeSeries } from 'data/Types/TimeSeries';

import { Collator } from './Collator';
import { Data } from './Data';
import { Domain } from './Domain';

type ResponseWithLoading<T, U extends TimeSeries<T>> = Response<T,U> & { readonly loading: boolean };

const loadingResponse = { loading: true, series: [], errors: [] };

const pollingSourceWithLoading = <T, U extends TimeSeries<T>>(polling: PollingSource<T,U>): (domain: AbsoluteDomain) => Observable<ResponseWithLoading<T,U>> =>
    (domain) => from((async () => ({ loading: false, ...await polling(domain) }))());

const streamingSourceWithLoading = <T, U extends TimeSeries<T>>(streaming: StreamingSource<T,U>): (domain: AbsoluteDomain) => Observable<ResponseWithLoading<T,U>> =>
    (domain) => streaming(domain[0]).pipe(map((response) => ({ loading: false, ...response })));

const prependSourceWithLoading = <T, U extends TimeSeries<T>>(source: (domain: AbsoluteDomain) => Observable<ResponseWithLoading<T,U>>): (domain: AbsoluteDomain) => Observable<ResponseWithLoading<T,U>> =>
    (domain) => concat(from([loadingResponse]), source(domain));

const collateStreamingResponses = <T, U extends TimeSeries<T>>(collator: Collator<T,U>): (previous: ResponseWithLoading<T,U>, next: ResponseWithLoading<T,U>) => ResponseWithLoading<T,U> =>
    ({series: previous}, {loading, series: next, errors}) => ({ loading, series: collator(...previous, ...next), errors });

const keepPreviousResultsUntilLoaded = <T, U extends TimeSeries<T>>({series, errors}: ResponseWithLoading<T,U>, next: ResponseWithLoading<T,U>): ResponseWithLoading<T,U> =>
    next.loading ? { loading: true, series, errors } : next;

const splitResponseToData = <T, U extends TimeSeries<T>>({ loading, series, errors }: ResponseWithLoading<T,U>): Data<T,U>[] =>
    series.map((series) => ({ loading, series, errors }));

const getDataFromPollingSource = <T, U extends TimeSeries<T>>(polling: PollingSource<T,U>, absolute: Observable<AbsoluteDomain>): Observable<Data<T,U>[]> =>
    absolute.pipe(
        exhaustMap(prependSourceWithLoading(pollingSourceWithLoading(polling))),
        scan(keepPreviousResultsUntilLoaded, loadingResponse as ResponseWithLoading<T,U>),
        map(splitResponseToData),
    );

const getDataFromStreamingSource = <T, U extends TimeSeries<T>>(polling: PollingSource<T,U>, streaming: StreamingSource<T,U>, absolute: Observable<AbsoluteDomain>, relative: Observable<RelativeDomain>, isRelative: Observable<boolean>, collator: Collator<T,U>): Observable<Data<T,U>[]> =>
    isRelative.pipe(
        switchMap((isRelative) => isRelative
            ? relative.pipe(
                map(({last}) => [moment().subtract(last), moment()] as AbsoluteDomain),
                switchMap((domain) => prependSourceWithLoading(streamingSourceWithLoading(streaming))(domain).pipe(
                    scan(collateStreamingResponses(collator))
                )),
            )
            : absolute.pipe(
                exhaustMap(prependSourceWithLoading(pollingSourceWithLoading(polling))),
            )
        ),
        scan(keepPreviousResultsUntilLoaded, loadingResponse as ResponseWithLoading<T,U>),
        map(splitResponseToData),
    );

export class Collector<T, U extends TimeSeries<T>> {
    constructor(domain: Domain, source: Source<T,U>, collator: Collator<T,U>) {
        this.source = source;
        const subject = this.data = new BehaviorSubject<Data<T,U>[]>([]);

        const data = hasStreamingCapabilitiles(source)
            ? getDataFromStreamingSource(source[0], source[1], domain.absolute, domain.relative, domain.isRelative, collator)
            : getDataFromPollingSource(source, domain.absolute);

        this._subscription = data.subscribe(subject);
    }

    private readonly _subscription: Subscription;

    readonly source: Source<T,U>;
    readonly data: Observable<Data<T,U>[]>;

    stop(): void {
        this._subscription.unsubscribe();
    }
}
