import React from 'react';
import ReactDOM from 'react-dom';

import './theme/theme';
import './index.scss';

import { Region, RegionControls, DataSet, Select } from '@dolittle/observability.components';
import { useMetrics, useLogs } from '@dolittle/observability.components/Selection';
import { PrometheusConfiguration, PrometheusQuery } from '@dolittle/observability.sources';

// import { Timeseries, printHello } from '@dolittle/observability.data/Timeseries/Timeseries';

// const test: Timeseries = 1;
// printHello();

const Inner = (): JSX.Element => {
    const { series: metrics } = useMetrics();
    const { series: logs } = useLogs();
    console.log('Metrics', metrics);
    console.log('Logs', logs);
    return null;
}

const App = (): JSX.Element => {
    return (
        <PrometheusConfiguration serverUrl='http://localhost:8080/api/prom/api/v1' step={60}>
            <Region>
                <DataSet name='cpu'>
                    <PrometheusQuery name='load' query='100 - avg by (node) (irate(node_cpu_seconds_total{mode="idle"}[5m])*100)' />
                </DataSet>

                <RegionControls/>

                <Inner/>
            </Region>
        </PrometheusConfiguration>
    );
};

ReactDOM.render(<App />, document.getElementById('root'));
