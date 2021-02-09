import React, { useEffect, useState } from 'react';
import moment from 'moment';

import { SelectedLogs, useLogs, useSelectedLogs } from '@dolittle/observability.components/Selection';
import { ObservableTransform, useObservableWithTransform } from '@dolittle/observability.components/Utilities/Reactive';
import { flatten, LogEntry } from '@dolittle/observability.data/Types/LogSeries';

import { ListProps } from './List.props';
import { map } from 'rxjs/operators';

type LogEntries = {
    readonly entries: readonly LogEntry[];
    readonly skippedEnd: number;
};

const createTransform = (maxEntries?: number): ObservableTransform<SelectedLogs, LogEntries> =>
    (logs) => logs.pipe(
        map(({ series }) => flatten(...series).sort((a, b) => b.time - a.time)),
        map((entries) => {
            if (maxEntries === undefined || entries.length < maxEntries) {
                return { entries, skippedEnd: 0 };
            }

            return { entries: entries.slice(0, maxEntries), skippedEnd: entries.length - maxEntries }
        })
    );

export const List = (props: ListProps): JSX.Element => {
    const logs = useSelectedLogs();

    const [transform, setTransform] = useState<ObservableTransform<SelectedLogs, LogEntries>>();
    useEffect(() => {
        setTransform(() => createTransform(props.maxLines));
    }, [props.maxLines])

    const { entries, skippedEnd } = useObservableWithTransform(logs, transform) ?? { entries: [], skippedEnd: 0};

    return (
        <div>
            {
                entries.map((entry, n) => (
                    <div key={n} style={{ whiteSpace: 'nowrap' }}>
                        <span style={{ display: 'inline-block', width: '10em' }}>{moment(entry.time).format('YYYY-MM-DD HH:mm:ss')}</span>
                        <span>{entry.value}</span>
                    </div>
                ))
            }
            {
                skippedEnd > 0 &&
                <div>{skippedEnd} more lines...</div>
            }
        </div>
    );
};
