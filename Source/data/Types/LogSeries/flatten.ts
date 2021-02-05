import { LogEntry } from './LogEntry';
import { LogSeries } from './LogSeries';

const reduce = (entries: LogEntry[], series: LogSeries): LogEntry[] => {
    const entriesLength = entries.length, seriesLength = series.times.length, length = entriesLength+seriesLength;
    const nextEntries = new Array<LogEntry>(length);

    let i = 0, j = 0, k = 0;
    while (i < entriesLength && j < seriesLength) {
        if (entries[i].time <= series.times[j]) {
            nextEntries[k] = entries[i];
            i++;
        } else {
            nextEntries[k] = { time: series.times[j], value: series.values[j], series };
            j++;
        }
        k++;
    }
    while (i < entriesLength) {
        nextEntries[k] = entries[i];
        i++;
        k++;
    }
    while (j < seriesLength) {
        nextEntries[k] = { time: series.times[j], value: series.values[j], series };
        j++;
        k++;
    }

    return nextEntries;
}

export const flatten = (...series: LogSeries[]): LogEntry[] =>
    series.reduce(reduce, []);
