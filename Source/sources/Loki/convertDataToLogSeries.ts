import { LogSeries, collate as collateLogs } from '@dolittle/observability.data/Types/LogSeries';
import { Name } from '@dolittle/observability.data/Types/TimeSeries';

import { Stream, StreamData } from 'sources/Loki/Types';

const convertStreamAndDataToLogSeries = (stream: Stream, data: [string, string][], name: Name): LogSeries => {
    const result = {
        labels: new Map(Object.entries(stream)),
        dataset: '',
        name: name,
    };

    if (data.length === 0) return { ...result, dataset: '', times: [], values: [] };

    const times = new Array<number>(data.length);
    const values = new Array<string>(data.length);

    for (let i = 0; i < data.length; i++) {
        const [time, value] = data[data.length-i-1];
        times[i] = parseFloat(time)/1e6;
        values[i] = value;
    }

    return { ...result, times, values };
};

export const convertDataToLogSeries = (data: StreamData[], name: Name, collate: boolean): LogSeries[] => {
    const result = data.map(({stream, values}) => convertStreamAndDataToLogSeries(stream, values, name));
    
    if (collate) return collateLogs(...result);

    return result;
};
