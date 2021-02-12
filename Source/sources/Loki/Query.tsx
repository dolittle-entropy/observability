import React from 'react';
import { BehaviorSubject } from 'rxjs';

import { LogSource } from '@dolittle/observability.components/Sources';
import { Response } from '@dolittle/observability.data/Sources';
import { LogSeries } from '@dolittle/observability.data/Types/LogSeries';

import { useConfiguration } from 'sources/Loki/Configuration';
import { isResponse, isStreamingResponse } from 'sources/Loki/Types';
import { fetchJSON } from 'sources/Utilities/fetchJSON';
import { websocketJSON } from 'sources/Utilities/websocketJSON';

import { QueryProps } from './Query.props';
import { convertDataToLogSeries } from './convertDataToLogSeries';

export const Query = (props: QueryProps): JSX.Element => {
    const configuration = useConfiguration(props);

    return (
        <LogSource source={[
            async ([from, to]) => {
                try {
                    if (typeof configuration.serverUrl !== 'string') throw 'ServerUrl is not configured';
                    if (typeof configuration.limit !== 'number') throw 'Limit is not configured';

                    const url = `${configuration.serverUrl}/query_range?query=${encodeURIComponent(props.query)}&start=${from.unix()}&end=${to.unix()}&limit=${configuration.limit}`;
                    const response = await fetchJSON(url, isResponse);

                    if (response.status === 'error') throw response.error;
                    if (response.data.resultType !== 'streams') throw 'Only Streams data types supported';

                    return { series: convertDataToLogSeries(response.data.result, props.name, false), errors: [] };
                } catch (error) {
                    return { series: [], errors: [error] }
                }
            },
            (from) => {
                const logs = new BehaviorSubject<Response<string, LogSeries>>({ series: [], errors: [] });

                if (typeof configuration.websocketServerUrl !== 'string') {
                    logs.next({ series: [], errors: ['WebsocketServerUrl is not configured'] });
                    return logs;
                }
                if (typeof configuration.limit !== 'number') {
                    logs.next({ series: [], errors: ['Limit is not configured'] });
                    return logs;
                }

                const url = `${configuration.websocketServerUrl}/tail?query=${encodeURIComponent(props.query)}&start=${from.unix()}&limit=${configuration.limit}`;
                websocketJSON(
                    url,
                    isStreamingResponse,
                    (data) => {
                        logs.next({ series: convertDataToLogSeries(data.streams, props.name, true), errors: [] })
                    },
                    (error) => {
                        logs.next({ series: [], errors: [error] });
                    },
                );

                return logs;
            },
        ]}/>
    );
}