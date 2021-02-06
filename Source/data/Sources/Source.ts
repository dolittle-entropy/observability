import { TimeSeries } from 'data/Types/TimeSeries';

import { PollingSource } from './PollingSource';
import { StreamingSource } from './StreamingSource';

export type Source<T, U extends TimeSeries<T>> = PollingSource<T,U> | [ PollingSource<T,U>, StreamingSource<T,U> ];
