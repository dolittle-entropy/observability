import { MergeCallback } from './MergeCallback';
import { TimeSeries } from './TimeSeries';
import { Timestamp } from './Timestamp';

type merge = {
    <T>(into: TimeSeries<T>, from: TimeSeries<T>): TimeSeries<T>;
    <T, U extends TimeSeries<T>>(into: U, from: U, callback: MergeCallback<T,U>): U;
};

export const merge: merge = <T, U extends TimeSeries<T>>(into: U, from: U, callback?: MergeCallback<T,U>): U => {
    const intoLength = into.times.length, fromLength = from.times.length, length = intoLength+fromLength;
    const times = new Array<Timestamp>(length);
    const values = new Array<T>(length);

    let i = 0, j = 0, k = 0;
    while (i < intoLength && j < fromLength) {
        if (into.times[i] <= from.times[i]) {
            times[k] = into.times[i];
            values[k] = into.values[i];
            i++;
        } else {
            times[k] = from.times[j];
            values[k] = from.values[j];
            j++;
        }
        k++;
    }
    while (i < intoLength) {
        times[k] = into.times[i];
        values[k] = into.values[i];
        i++;
        k++;
    }
    while (i < fromLength) {
        times[k] = from.times[j];
        values[k] = from.values[j];
        j++;
        k++;
    }

    if (callback !== undefined) return callback(into, from, times, values);
    else return { ...into, times, values };
};
