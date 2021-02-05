import { Moment } from 'moment';
import { Observable } from 'rxjs';

import { TimeSeries } from 'Types/TimeSeries';

import { Response } from './Response';

export type StreamingSource<T, U extends TimeSeries<T>> = (from: Moment) => Observable<Response<T,U>>;
