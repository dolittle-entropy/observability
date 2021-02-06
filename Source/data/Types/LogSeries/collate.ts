import { collate as collateTimeSeries } from 'data/Types/TimeSeries';

import { LogSeries } from './LogSeries';

export const collate = (...series: LogSeries[]): LogSeries[] =>
    collateTimeSeries(series);
