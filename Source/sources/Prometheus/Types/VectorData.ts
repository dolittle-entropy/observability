import { Metric } from './Metric';

export type VectorData = {
    resultType: 'vector';
    result: {
        metric: Metric;
        value: [number, string];
    }[];
};
