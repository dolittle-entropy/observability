import { TimeSeries } from 'data/Types/TimeSeries';

import { PollingSource } from './PollingSource';
import { Source } from './Source';
import { StreamingSource } from './StreamingSource';

export const hasStreamingCapabilitiles = <T, U extends TimeSeries<T>>(source: Source<T,U>): source is [ PollingSource<T,U>, StreamingSource<T,U> ] =>
    Array.isArray(source) &&
    source.length === 2 &&
    typeof source[1] === 'function';
