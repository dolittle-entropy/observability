import { Metric } from './Metric';

export type MatrixData = {
    resultType: 'matrix';
    result: {
        metric: Metric;
        values: [number, string][];
    }[];
};
