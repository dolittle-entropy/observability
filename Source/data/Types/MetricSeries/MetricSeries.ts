import { TimeSeries } from 'Types/TimeSeries';

export type MetricSeries = TimeSeries<number> & { readonly range: readonly [number, number] };
