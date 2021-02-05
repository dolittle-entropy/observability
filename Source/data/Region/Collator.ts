import { TimeSeries } from 'Types/TimeSeries';

export type Collator<T, U extends TimeSeries<T>> = (...series: readonly U[]) => readonly U[];
