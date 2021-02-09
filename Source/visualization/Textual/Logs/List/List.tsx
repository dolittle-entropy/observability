import React from 'react';

import { useLogs } from '@dolittle/observability.components/Selection';
import { flatten } from '@dolittle/observability.data/Types/LogSeries';

import { ListProps } from './List.props';

export const List = (props: ListProps): JSX.Element => {
    const { series } = useLogs();
    const entries = flatten(...series);

    const rows = new Array<JSX.Element>(entries.length);
    for (let n = entries.length-1; n >= 0; n--) {
        const entry = entries[n];
        rows[entries.length+1-n] = (
            <div key={n}>{entry.time} :-&gt; {entry.value}</div>
        );
    }

    return (
        <div>
            { rows }
        </div>
    );
};
