import React from 'react';
import ReactDOM from 'react-dom';

import './theme/theme';
import './index.scss';

import { Region, RegionControls, DataSet, Select } from '@dolittle/observability.components';
import { LokiConfiguration, LokiQuery, PrometheusConfiguration, PrometheusQuery } from '@dolittle/observability.sources';
import { Figure, Axes } from '@dolittle/observability.visualization/Graphical';
import { Horizontal } from '@dolittle/observability.visualization/Graphical/Metrics/Layout';
import { Plot, CurrentValue, Legend } from '@dolittle/observability.visualization/Graphical/Metrics';
import { List } from '@dolittle/observability.visualization/Textual/Logs';


const App = (): JSX.Element => {
    return (
        <PrometheusConfiguration serverUrl='http://localhost:8080/api/prom/api/v1' step={60}>
            <LokiConfiguration serverUrl='http://localhost:8080/loki/api/v1' websocketServerUrl='ws://localhost:8080/loki/api/v1' limit={2000}>
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
                                    <Plot range={[0, 3]} />
                                    <CurrentValue format={v => `${v.toFixed(2)}mb/s`} />
                                    <Legend />
                                </Horizontal>
                            </Axes>
                        </Select>
                    </Figure>

                    <List maxLines={30} hoverContextLines={8}/>
                </Region>
            </LokiConfiguration>
        </PrometheusConfiguration>
    );
};

ReactDOM.render(<App />, document.getElementById('root'));
