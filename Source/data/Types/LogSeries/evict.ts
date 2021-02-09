import { Moment } from 'moment';

import { evict as evictTimeSeries } from 'data/Types/TimeSeries';

import { LogSeries } from './LogSeries';

export const evict = (keepAfter: Moment, ...series: LogSeries[]): LogSeries[] =>
    evictTimeSeries(keepAfter, series);
