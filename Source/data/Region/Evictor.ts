import { Moment } from 'moment';

import { TimeSeries } from 'data/Types/TimeSeries';

export type Evictor<T, U extends TimeSeries<T>> = (keepAfter: Moment, ...series: readonly U[]) => readonly U[];
