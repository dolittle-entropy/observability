import { Error } from 'data/Sources';
import { TimeSeries } from 'data/Types/TimeSeries';

export type Data<T, U extends TimeSeries<T>> = {
    readonly loading: boolean;
    readonly series: U;
    readonly errors: readonly Error[];
};
