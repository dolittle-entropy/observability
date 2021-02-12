import React, { useEffect, useState } from 'react';

import { Selector, SelectorPredicate, useSelectedMetrics, SelectedMetrics } from '@dolittle/observability.components/Selection';
import { ObservableTransform, useObservableWithTransform } from '@dolittle/observability.components/Utilities/Reactive';
import { LabelName } from '@dolittle/observability.data/Types/Labels';
import { MetricSeries } from '@dolittle/observability.data/Types/MetricSeries';

import { ForEachProps } from './ForEach.props';
import { distinctUntilChanged, map } from 'rxjs/operators';

type Keys = (string|number)[];

const calculateKeys = (series: readonly MetricSeries[], groupBy?: LabelName): Keys =>
    typeof groupBy === 'string'
    ? [...new Set(series.map(_ => _.labels.has(groupBy) ? _.labels.get(groupBy) : ''))]
    : [...series.keys()];

const distinctKeys = distinctUntilChanged<Keys>((current, next) =>
    current?.length === next?.length && current.every((key, n) => key === next[n])
);

type SelectorWithKey = [string|number, SelectorPredicate];

const createSelectorsWithKeys = (keys: Keys, groupBy?: LabelName): SelectorWithKey[] =>
    keys.map(key =>
        typeof key === 'number'
        ? [key, (_, i) => i === key]
        : [key, (data, _) => (data.series.labels.get(groupBy) ?? '') === key]
    )

const createTransform = (groupBy?: LabelName): ObservableTransform<SelectedMetrics,SelectorWithKey[]> =>
    (metrics) => metrics.pipe(
        map(({series}) => calculateKeys(series, groupBy)),
        distinctKeys,
        map((keys) => createSelectorsWithKeys(keys, groupBy))
    );

export const ForEach = (props: ForEachProps): JSX.Element => {
    const metrics = useSelectedMetrics();

    const [transform, setTransform] = useState(() => createTransform(props.groupBy));
    useEffect(() => {
        setTransform(() => createTransform(props.groupBy));
    }, [props.groupBy]);
    
    const selectorsWithKeys = useObservableWithTransform(metrics, transform);
    
    if (!selectorsWithKeys?.length) return null;

    return (
        <>
            {
                selectorsWithKeys.map(([key, predicate], n) =>
                    <Selector key={key} predicate={predicate}>
                        { props.render(n, selectorsWithKeys.length) }
                    </Selector>
                )
            }
        </>
    );
};
