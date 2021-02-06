import { hasOwnProperty } from '@dolittle/observability.data/Utilities/Typing';

import { isMetric } from './isMetric';
import { VectorData } from './VectorData';

export const isVectorData = (obj: unknown): obj is VectorData =>
    Array.isArray(obj) && !obj.some((_: unknown) => {
        if (typeof _ !== 'object') return false;
        if (!hasOwnProperty(_, 'metric') || !isMetric(_.metric)) return false;
        if (!hasOwnProperty(_, 'value') || !Array.isArray(_.value)) return false;
        return _.value.length === 2 && typeof _.value[0] === 'number' && typeof _.value[1] === 'string';
    });
