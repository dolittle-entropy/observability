import { Moment } from 'moment';

import { evict as evictTimeSeries } from 'data/Types/TimeSeries';

import { MetricSeries } from './MetricSeries';

export const evict = (keepAfter: Moment, ...series: MetricSeries[]): MetricSeries[] =>
    evictTimeSeries<number,MetricSeries>(keepAfter, series, (series, times, values) => {
        if (times.length === series.times.length) {
            return series;
        } else if (times.length === 0) {
            return { ...series, times, values, range: [0, 0] };
        } else {
            let minValue = Number.MAX_VALUE, maxValue = -Number.MAX_VALUE;
            for (let i = 0; i < times.length; i++) {
                const value = values[i];
                minValue = value < minValue ? value : minValue;
                maxValue = value > maxValue ? value : maxValue;
            }
            return { ...series, times, values, range: [minValue, maxValue] };
        }
    });
