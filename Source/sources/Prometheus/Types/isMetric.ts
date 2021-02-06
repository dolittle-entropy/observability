import { hasOwnProperty } from '@dolittle/observability.data/Utilities/Typing';

import { Metric } from './Metric';

export const isMetric = (obj: unknown): obj is Metric =>
    typeof obj === 'object' &&
    hasOwnProperty(obj, '__name__') &&
    !Object.values(obj).some(_ => typeof _ !== 'string');
