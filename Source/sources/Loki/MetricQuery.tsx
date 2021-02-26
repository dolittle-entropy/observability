import React from 'react';

import { MetricSource } from '@dolittle/observability.components/Sources';

import { useConfiguration } from 'sources/Loki/Configuration';
import { isResponse } from 'sources/Prometheus/Types';
import { convertDataToMetricSeries } from 'sources/Prometheus';
import { fetchJSON } from 'sources/Utilities/fetchJSON';

import { MetricQueryProps } from './MetricQuery.props';

export const MetricQuery = (props: MetricQueryProps): JSX.Element => {
    const configuration = useConfiguration(props);


    return (
        <MetricSource source={async ([from, to]) => {
            try {
                if (typeof configuration.serverUrl !== 'string') throw 'ServerUrl is not configured';
                if (typeof configuration.limit !== 'number') throw 'Limit is not configured';

                const url = `${configuration.serverUrl}/query_range?query=${encodeURIComponent(props.query)}&start=${from.unix()}&end=${to.unix()}&limit=${configuration.limit}`;
                const response = await fetchJSON(url, isResponse);

                if (response.status === 'error') throw response.error;
                if (response.data.resultType !== 'matrix' && response.data.resultType !== 'vector') throw 'Only Matrix and Vector data types supported';

                return { series: convertDataToMetricSeries(response.data, props.name), errors: [] };
            } catch (error) {
                return { series: [], errors: [error] }
            }
        }}/>
    );
};
