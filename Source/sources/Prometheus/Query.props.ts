import { Name } from '@dolittle/observability.data/Types/TimeSeries';

import { Configuration } from 'sources/Prometheus/Configuration';

export type QueryProps = {
    name?: Name;
    query: string;
} & Configuration;
