import { isDuration } from 'moment';

import { hasOwnProperty } from 'data/Utilities/Typing';

import { RelativeDomain } from './RelativeDomain';

export const isRelativeDomain = (obj: unknown): obj is RelativeDomain =>
    typeof obj === 'object' &&
    hasOwnProperty(obj, 'last') &&
    hasOwnProperty(obj, 'refresh') &&
    isDuration(obj.last) &&
    isDuration(obj.refresh) &&
    obj.last.asMilliseconds() > 0 &&
    obj.refresh.asMilliseconds() > 0;