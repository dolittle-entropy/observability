import { TimeSeries } from './TimeSeries';
import { Timestamp } from './Timestamp';

export type MergeCallback<T, U extends TimeSeries<T>> = (into: U, from: U, times: Timestamp[], values: T[]) => U;
