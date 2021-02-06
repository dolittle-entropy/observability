import { useEffect } from 'react';

import { map } from 'rxjs/operators';

import { Collection } from '@dolittle/observability.data/Region';
import { hasStreamingCapabilitiles, PollingSource, Response, Source, StreamingSource } from '@dolittle/observability.data/Sources';
import { DataSet, TimeSeries } from '@dolittle/observability.data/Types/TimeSeries';
import { LabelName, Labels as DataLabels, LabelValue } from '@dolittle/observability.data/Types/Labels';

import { Labels } from 'components/DataSet/Labels';
import { useDataSet } from 'components/DataSet/useDataSet';

type Constructor<T, U extends TimeSeries<T>> = (series: U, dataset: DataSet, labels: DataLabels) => U;

const mergeLabels = (original: DataLabels, extra: Labels): DataLabels =>
    new Map<LabelName, LabelValue>([...original, ...Object.entries(extra)]);

const addDataSetAndLabelsToResponse = <T, U extends TimeSeries<T>>({ series, errors }: Response<T,U>, dataset: DataSet, labels: Labels, constructor: Constructor<T,U>): Response<T,U> =>
    ({ series: series.map(_ => constructor(_, dataset, mergeLabels(_.labels, labels))), errors });

const addDataSetAndLabelsToPollingSource = <T, U extends TimeSeries<T>>(source: PollingSource<T,U>, dataset: DataSet, labels: Labels, constructor: Constructor<T,U>): PollingSource<T,U> =>
    async (domain) => addDataSetAndLabelsToResponse(await source(domain), dataset, labels, constructor);

const addDataSetAndLabelsToStreamingSource = <T, U extends TimeSeries<T>>(source: StreamingSource<T,U>, dataset: DataSet, labels: Labels, constructor: Constructor<T,U>): StreamingSource<T,U> =>
    (from) => source(from).pipe(map(_ => addDataSetAndLabelsToResponse(_, dataset, labels, constructor)));

const addDataSetAndLabelsToSource = <T, U extends TimeSeries<T>>(source: Source<T,U>, dataset: DataSet, labels: Labels, constructor: Constructor<T,U>): Source<T,U> =>
    hasStreamingCapabilitiles(source)
    ? [ addDataSetAndLabelsToPollingSource(source[0], dataset, labels, constructor), addDataSetAndLabelsToStreamingSource(source[1], dataset, labels, constructor) ]
    : addDataSetAndLabelsToPollingSource(source, dataset, labels, constructor);

export const useSource = <T, U extends TimeSeries<T>>(collection: Collection<T,U>, source: Source<T,U>, constructor: Constructor<T,U>): void => {
    const [dataset, labels] = useDataSet();

    useEffect(() => {
        if (!collection || !source) return;

        const withDataSetAndLabels = addDataSetAndLabelsToSource(source, dataset, labels, constructor);

        collection.addSource(withDataSetAndLabels);
        return () => collection.removeSource(withDataSetAndLabels);
    }, [collection, source, dataset, labels]);
};
