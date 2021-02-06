import { MetricSeries } from 'data/Types/MetricSeries';

import { Source } from './Source';

export type MetricSource = Source<number, MetricSeries>;
