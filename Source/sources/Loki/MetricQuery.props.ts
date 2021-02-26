import { Name } from '@dolittle/observability.data/Types/TimeSeries';

import { Configuration } from 'sources/Loki/Configuration';

export type MetricQueryProps = {
    name: Name;
    query: string;
} & Configuration;
