import { MatrixData } from './MatrixData';
import { ScalarData } from './ScalarData';
import { StringData } from './StringData';
import { VectorData } from './VectorData';

export type Response = {
    status: 'success';
    data: MatrixData | VectorData | ScalarData | StringData;
    warnings?: string[];
} | {
    status: 'error';
    errorType: string;
    error: string;
    data?: MatrixData | VectorData | ScalarData | StringData;
    warnings?: string[];
};
