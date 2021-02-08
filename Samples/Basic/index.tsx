import React from 'react';
import ReactDOM from 'react-dom';

import './theme/theme';
import './index.scss';

import { Region, RegionControls, DataSet, Select } from '@dolittle/observability.components';
import { useMetrics, useLogs } from '@dolittle/observability.components/Selection';
import { LokiConfiguration, LokiQuery, PrometheusConfiguration, PrometheusQuery } from '@dolittle/observability.sources';
import { Figure, Axes, Horizontal } from '@dolittle/observability.visualization/Graphical/Layout';
import { Plot } from '@dolittle/observability.visualization/Graphical/Plot';
import { CurrentValue } from '@dolittle/observability.visualization/Graphical/CurrentValue';
import { Legend } from '@dolittle/observability.visualization/Graphical/Legend';

// import { Timeseries, printHello } from '@dolittle/observability.data/Timeseries/Timeseries';

// const test: Timeseries = 1;
// printHello();

const Inner = (): JSX.Element => {
    // const { series: metrics } = useMetrics();
    // const { series: logs } = useLogs();
    // console.log('Metrics', metrics);
    // console.log('Logs', logs);
    return null;
}

const App = (): JSX.Element => {
    return (
        <PrometheusConfiguration serverUrl='http://localhost:8080/api/prom/api/v1' step={60}>
            <LokiConfiguration serverUrl='http://localhost:8080/loki/api/v1' websocketServerUrl='ws://localhost:8080/loki/api/v1'>
                <Region>
                    <DataSet name='cpu'>
                        <PrometheusQuery query='100 - avg by (node) (irate(node_cpu_seconds_total{mode="idle"}[5m])*100)' name='load' />
                    </DataSet>
                    <DataSet name='network'>
                        <PrometheusQuery query='sum by (node) (rate(node_network_transmit_bytes_total[5m])/1048576)' name='transmit'/>
                        <PrometheusQuery query='sum by (node) (rate(node_network_receive_bytes_total[5m])/1048576)' name='receive'/>
                    </DataSet>

                    <DataSet name='journal'>
                        <LokiQuery name='journal' query='{job="node-journal"}' />
                    </DataSet>

                    <RegionControls/>

                    <Inner/>
                    <Figure width={1400} height={500}>
                        <Select dataset='cpu'>
                            <Axes position={[0, 0, 1400, 200]}>
                                <Horizontal>
                                    <Plot range={[0, 100]} />
                                    <CurrentValue format={v => `${Math.round(v)}%`} />
                                    <Legend />
                                </Horizontal>
                            </Axes>
                        </Select>
                        <Select dataset='network'>
                            <Axes position={[0, 300, 1400, 200]}>
                                <Horizontal groupBy='node'>
                                    <Plot range={[0, 2]} />
                                    <CurrentValue format={v => `${v.toFixed(2)}mb/s`} />
                                    <Legend />
                                </Horizontal>
                            </Axes>
                        </Select>
                    </Figure>
                </Region>
            </LokiConfiguration>
        </PrometheusConfiguration>
    );
};

ReactDOM.render(<App />, document.getElementById('root'));
