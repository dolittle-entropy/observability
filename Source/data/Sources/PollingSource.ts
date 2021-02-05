import { AbsoluteDomain } from 'Types/Domain';
import { TimeSeries } from 'Types/TimeSeries';

import { Response } from './Response';

export type PollingSource<T, U extends TimeSeries<T>> = (domain: AbsoluteDomain) => Promise<Response<T,U>>;
