import { TimeSeries } from 'Types/TimeSeries';

import { Error } from './Error';

export type Response<T, U extends TimeSeries<T>> = {
    readonly series: readonly U[];
    readonly errors: readonly Error[];
};
