import { TimeSeries } from 'Types/TimeSeries';

export type MetricSeries = TimeSeries<number> & { range: [number, number] };
