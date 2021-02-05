import { MetricSeries } from 'Types/MetricSeries';
import { Source } from './Source';

export type MetricSource = Source<number, MetricSeries>;
