import { MetricSeries } from '@dolittle/observability.data/Types/MetricSeries';
import { SelectedData } from './SelectedData';

export type SelectedMetrics = SelectedData<number, MetricSeries>;
