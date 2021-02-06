import { hasOwnProperty } from '@dolittle/observability.data/Utilities/Typing';

import { isMatrixData, isVectorData, MatrixData, VectorData } from 'sources/Prometheus/Types';
import { isStreamDataArray } from './isStreamDataArray';

import { StreamsData } from './StreamsData';

export const isData = (obj: unknown): obj is StreamsData | MatrixData | VectorData => {
    if (typeof obj !== 'object') return false;
    if (!hasOwnProperty(obj, 'resultType')) return false;
    if (!hasOwnProperty(obj, 'result')) return false;
    switch (obj.resultType) {
        case 'streams':
            return isStreamDataArray(obj.result);
        case 'matrix':
            return isMatrixData(obj.result);
        case 'vector':
            return isVectorData(obj.result);
        default:
            return false;
    }
};
