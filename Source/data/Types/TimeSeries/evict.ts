import { Moment } from 'moment';

import { EvictCallback } from './EvictCallback';
import { TimeSeries } from './TimeSeries';
import { Timestamp } from './Timestamp';

type evict = {
    <T>(keepAfter: Moment, series: TimeSeries<T>[]): TimeSeries<T>[];
    <T, U extends TimeSeries<T>>(keepAfter: Moment, series: U[], callback: EvictCallback<T,U>): U[];
};

export const evict: evict = <T, U extends TimeSeries<T>>(keepAfter: Moment, series: U[], callback?: EvictCallback<T,U>): U[] =>
    series.map((series) => {
        const timeToFind = keepAfter.valueOf();

        const firstIndex = series.times.findIndex((time) => time >= timeToFind);

        const times = firstIndex < 0 ? [] : series.times.slice(firstIndex);
        const values = firstIndex < 0 ? [] : series.values.slice(firstIndex);

        if (callback !== undefined) return callback(series, times, values);
        else return { ...series, times, values };
    });
