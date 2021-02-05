import { Timestamp } from 'Types/TimeSeries';
import { LogSeries } from './LogSeries';

export type LogEntry = {
    readonly time: Timestamp;
    readonly value: string;
    readonly series: LogSeries;
};
