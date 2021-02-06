import React from 'react';

import { MetricSource } from '@dolittle/observability.components/Sources';

import { useConfiguration } from 'sources/Prometheus/Configuration';
import { fetchJSON } from 'sources/Utilities/fetchJSON';

import { QueryProps } from './Query.props';
import { isResponse } from './Types';
import { convertDataToTimeseries } from './convertDataToMetricSeries';

export const Query = (props: QueryProps): JSX.Element => {
    const configuration = useConfiguration(props);

    return (
        <MetricSource source={async ([from, to]) => {
            try {
                if (typeof configuration.serverUrl !== 'string') throw 'ServerUrl is not configured';
                if (typeof configuration.step !== 'number') throw 'Step is not configured';

                const url = `${configuration.serverUrl}/query_range?query=${encodeURIComponent(props.query)}&start=${from.unix()}&end=${to.unix()}&step=${configuration.step}`;
                const response = await fetchJSON(url, isResponse);

                if (response.status === 'error') throw response.error;
                if (response.data.resultType !== 'matrix' && response.data.resultType !== 'vector') throw 'Only Matrix and Vector data types supported';

                return { series: convertDataToTimeseries(response.data, props.name), errors: [] };
            } catch (error) {
                return { series: [], errors: [error] }
            }
        }}/>
    );
}