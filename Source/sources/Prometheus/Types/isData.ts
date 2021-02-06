import { hasOwnProperty } from '@dolittle/observability.data/Utilities/Typing';

import { isMatrixData } from './isMatrixData';
import { isScalarOrStringData } from './isScalarOrStringData';
import { isVectorData } from './isVectorData';
import { MatrixData } from './MatrixData';
import { ScalarData } from './ScalarData';
import { StringData } from './StringData';
import { VectorData } from './VectorData';

export const isData = (obj: unknown): obj is MatrixData | VectorData | ScalarData | StringData => {
    if (typeof obj !== 'object') return false;
    if (!hasOwnProperty(obj, 'resultType')) return false;
    if (!hasOwnProperty(obj, 'result')) return false;
    switch (obj.resultType) {
        case 'matrix':
            return isMatrixData(obj.result);
        case 'vector':
            return isVectorData(obj.result);
        case 'scalar':
        case 'string':
            return isScalarOrStringData(obj.result);
        default:
            return false;
    }
};
