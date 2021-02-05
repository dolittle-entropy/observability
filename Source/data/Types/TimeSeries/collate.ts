import { merge } from './merge';
import { MergeCallback } from './MergeCallback';
import { TimeSeries } from './TimeSeries';

const identify = <T>(series: TimeSeries<T>): string =>
    [series.name, series.dataset, ...series.labels].flat().join('\u0000');

type collate = {
    <T>(series: TimeSeries<T>[]): TimeSeries<T>[];
    <T, U extends TimeSeries<T>>(series: U[], mergeCallback: MergeCallback<T,U>): U[];
};

export const collate: collate = <T, U extends TimeSeries<T>>(series: U[], mergeCallback?: MergeCallback<T,U>): U[] =>
    Object.values(series.reduce((set, series) => {
        const identity = identify(series);
        if (identity in set) {
            set[identity] = merge(set[identity], series, mergeCallback);
        } else {
            set[identity] = series;
        }
        return set;
    }, {}));
