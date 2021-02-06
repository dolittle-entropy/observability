import { AbsoluteDomain } from 'data/Types/Domain';
import { TimeSeries } from 'data/Types/TimeSeries';

import { Response } from './Response';

export type PollingSource<T, U extends TimeSeries<T>> = (domain: AbsoluteDomain) => Promise<Response<T,U>>;
