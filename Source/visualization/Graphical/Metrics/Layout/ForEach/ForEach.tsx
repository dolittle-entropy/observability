import React, { useEffect, useState } from 'react';

import { Selector, SelectorPredicate, useMetrics } from '@dolittle/observability.components/Selection';
import { LabelName } from '@dolittle/observability.data/Types/Labels';
import { MetricSeries } from '@dolittle/observability.data/Types/MetricSeries';

import { ForEachProps } from './ForEach.props';

type Keys = (string|number)[];

const calculateKeys = (series: readonly MetricSeries[], groupBy?: LabelName): Keys =>
    typeof groupBy === 'string'
    ? [...new Set(series.map(_ => _.labels.has(groupBy) ? _.labels.get(groupBy) : ''))]
    : [...series.keys()];

type SelectorWithKey = [string|number, SelectorPredicate];

const createSelectorsWithKeys = (keys: Keys, groupBy?: LabelName): SelectorWithKey[] =>
    keys.map(key =>
        typeof key === 'number'
        ? [key, (_, i) => i === key]
        : [key, (data, _) => (data.series.labels.get(groupBy) ?? '') === key]
    )

export const ForEach = (props: ForEachProps): JSX.Element => {
    const { series } = useMetrics();

    const [keys, setKeys] = useState<Keys>([]);
    useEffect(() => {
        const newKeys = calculateKeys(series, props.groupBy);
        if (newKeys.length !== keys.length || keys.some((key, n) => newKeys[n] !== key)) {
            setKeys(newKeys);
        }
    }, [series]);


    const [selectorsWithKeys, setSelectorsWithKeys] = useState<SelectorWithKey[]>([]);
    useEffect(() => {
        setSelectorsWithKeys(createSelectorsWithKeys(keys, props.groupBy));
    }, [keys]);

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
