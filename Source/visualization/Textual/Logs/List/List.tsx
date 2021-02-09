import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { combineLatest } from 'rxjs';

import { useRegion } from '@dolittle/observability.components/Region';
import { SelectedLogs, useSelectedLogs } from '@dolittle/observability.components/Selection';
import { ObservableTransform, useObservableWithTransform } from '@dolittle/observability.components/Utilities/Reactive';
import { Hover } from '@dolittle/observability.data/Region';
import { flatten, LogEntry } from '@dolittle/observability.data/Types/LogSeries';

import { ListProps } from './List.props';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

type LogEntries = {
    readonly entries: readonly LogEntry[];
    readonly skippedEnd: number;
    readonly logsNotFound: boolean;
};

const createTransform = (hover: Observable<Hover>, maxEntries?: number, hoverContextLines?: number): ObservableTransform<SelectedLogs, LogEntries> =>
    (logs) => {
        const entries = logs.pipe(
            map(({ series }) => flatten(...series).sort((a, b) => b.time - a.time))
        );

        return combineLatest([entries, hover]).pipe(
            map(([entries, hover]) => {
                if (hover.isHovering) {
                    const hoverTime = hover.time.valueOf();
                    const hoverIndex = entries.findIndex(_ => _.time < hoverTime);

                    if (hoverIndex > 0) {
                        const contextLines = hoverContextLines ?? 5;
                        const startIndex = Math.max(hoverIndex - contextLines, 0);
                        const endIndex = Math.min(hoverIndex + contextLines + 1, entries.length);

                        return {
                            entries: entries.slice(startIndex, endIndex),
                            skippedEnd: 0,
                            logsNotFound: false,
                        }
                    }
                    
                    return {
                        entries: [],
                        skippedEnd: 0,
                        logsNotFound: true,
                    };
                }

                if (maxEntries === undefined || entries.length < maxEntries) {
                    return {
                        entries,
                        skippedEnd: 0,
                        logsNotFound: false,
                    };
                }

                return {
                    entries: entries.slice(0, maxEntries),
                    skippedEnd: entries.length - maxEntries,
                    logsNotFound: false,
                }
            })
        );
    };

export const List = (props: ListProps): JSX.Element => {
    const region = useRegion();
    const logs = useSelectedLogs();

    const [transform, setTransform] = useState<ObservableTransform<SelectedLogs, LogEntries>>();
    useEffect(() => {
        if (!region || !logs) return;

        setTransform(() => createTransform(region.selection.hover, props.maxLines, props.hoverContextLines));
    }, [region, logs, props.maxLines, props.hoverContextLines])

    const { entries, skippedEnd, logsNotFound } = useObservableWithTransform(logs, transform) ?? { entries: [], skippedEnd: 0, logsNotFound: false };

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
            {
                logsNotFound &&
                <div>No logs found at this time.</div>
            }
        </div>
    );
};
