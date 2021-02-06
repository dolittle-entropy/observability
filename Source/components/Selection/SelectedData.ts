import { Error } from '@dolittle/observability.data/Sources';
import { TimeSeries } from '@dolittle/observability.data/Types/TimeSeries';

export type SelectedData<T, U extends TimeSeries<T>> = {
    readonly loading: boolean;
    readonly series: U[];
    readonly errors: readonly Error[];
};
