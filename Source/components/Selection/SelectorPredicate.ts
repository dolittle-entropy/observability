import { Data } from '@dolittle/observability.data/Region';
import { TimeSeries } from '@dolittle/observability.data/Types/TimeSeries';

export type SelectorPredicate = (data: Data<unknown,TimeSeries<unknown>>, index: number) => boolean;
