import { TimeSeries } from './TimeSeries';
import { Timestamp } from './Timestamp';

export type EvictCallback<T, U extends TimeSeries<T>> = (series: U, times: Timestamp[], values: T[]) => U;
