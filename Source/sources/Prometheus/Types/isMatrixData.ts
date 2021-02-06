import { hasOwnProperty } from '@dolittle/observability.data/Utilities/Typing';

import { isMetric } from './isMetric';
import { MatrixData } from './MatrixData';

export const isMatrixData = (obj: unknown): obj is MatrixData =>
    Array.isArray(obj) && !obj.some((_: unknown) => {
        if (typeof _ !== 'object') return false;
        if (!hasOwnProperty(_, 'metric') || !isMetric(_.metric)) return false;
        if (!hasOwnProperty(_, 'values') || !Array.isArray(_.values)) return false;
        return !_.values.some((_: unknown) => {
            return Array.isArray(_) && _.length === 2 && typeof _[0] === 'number' && typeof _[1] === 'string';
        });
    });
