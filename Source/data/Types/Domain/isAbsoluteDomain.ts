import { isMoment } from 'moment';

import { AbsoluteDomain } from './AbsoluteDomain';

export const isAbsoluteDomain = (obj: unknown): obj is AbsoluteDomain =>
    Array.isArray(obj) &&
    obj.length === 2 &&
    isMoment(obj[0]) &&
    isMoment(obj[1]) &&
    obj[0].isBefore(obj[1]);
