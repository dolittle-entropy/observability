import { Error } from 'Sources';
import { TimeSeries } from 'Types/TimeSeries';

export type Data<T, U extends TimeSeries<T>> = {
    readonly loading: boolean;
    readonly series: U;
    readonly errors: readonly Error[];
};
