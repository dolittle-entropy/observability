import { MatrixData, VectorData } from 'sources/Prometheus/Types';

import { StreamsData } from './StreamsData';

export type Response = {
    status: 'success';
    data: StreamsData | MatrixData | VectorData;
    warnings?: string[];
} | {
    status: 'error';
    errorType: string;
    error: string;
    data?: StreamsData | MatrixData | VectorData;
    warnings?: string[];
};
