import { MetricSeries } from '@dolittle/observability.data/Types/MetricSeries';

import { MatrixData, Metric, VectorData } from './Types';

const convertMetricAndValuesToMetricSeries = (metric: Metric, data: [number, string][], nameOverride?: string): MetricSeries => {
    const result = {
        name: nameOverride ?? metric.__name__,
        labels: new Map(Object.entries(metric).filter(([name]) => name !== '__name__')),
        dataset: '',
    };

    if (data.length === 0) return { ...result, times: [], values: [], range: [0, 0] };

    let minValue = Number.MAX_VALUE, maxValue = -Number.MAX_VALUE;
    const times = new Array<number>(data.length);
    const values = new Array<number>(data.length);

    for (let i = 0; i < data.length; i++) {
        const time = data[i][0]*1000, value = parseFloat(data[i][1]);
        times[i] = time;
        values[i] = value;
        minValue = value < minValue ? value : minValue;
        maxValue = value > maxValue ? value : maxValue;
    }
    return { ...result, times, values, range: [minValue, maxValue] };
};


export const convertDataToTimeseries = (data: MatrixData | VectorData, nameOverride?: string): MetricSeries[] =>
    data.resultType === 'matrix'
    ? data.result.map(({metric, values}) => convertMetricAndValuesToMetricSeries(metric, values, nameOverride))
    : data.result.map(({metric, value}) => convertMetricAndValuesToMetricSeries(metric, [value], nameOverride));
