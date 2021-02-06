import { collate as collateTimeSeries } from 'data/Types/TimeSeries';

import { MetricSeries } from './MetricSeries';

export const collate = (...series: MetricSeries[]): MetricSeries[] =>
    collateTimeSeries<number,MetricSeries>(series, (into, from, times, values ) => {
        const range: [number,number] = [ Math.min(...into.range, ...from.range), Math.max(...into.range, ...from.range) ];
        return { ...into, times, values, range };
    });
