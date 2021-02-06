import { LogSeries } from '@dolittle/observability.data/Types/LogSeries';
import { SelectedData } from './SelectedData';

export type SelectedLogs = SelectedData<string, LogSeries>;
