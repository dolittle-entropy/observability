import React from 'react';
import ReactDOM from 'react-dom';

import './theme/theme';
import './index.scss';

import { Region, RegionControls, DataSet, Select } from '@dolittle/observability.components';
import { LokiConfiguration, LokiMetricQuery, LokiQuery, PrometheusConfiguration, PrometheusQuery } from '@dolittle/observability.sources';
import { Figure, Axes } from '@dolittle/observability.visualization/Graphical';
import { Font } from '@dolittle/observability.visualization/Graphical/Fonts';
import { Horizontal } from '@dolittle/observability.visualization/Graphical/Metrics/Layout';
import { Plot, CurrentValue, Legend } from '@dolittle/observability.visualization/Graphical/Metrics';
import { List } from '@dolittle/observability.visualization/Textual/Logs';


const App = (): JSX.Element => {
    return (
        <PrometheusConfiguration serverUrl='http://localhost:8080/api/prom/api/v1' step={60}>
            <LokiConfiguration serverUrl='http://localhost:8080/loki/api/v1' websocketServerUrl='ws://localhost:8080/loki/api/v1' limit={2000}>
                <Region>
                    <DataSet name='ingress'>
                        <LokiQuery name='access' query='{job="ingress-access"}' />
                        <PrometheusQuery name='Request Duration' query='histogram_quantile(0.5, rate(microservice:dolittle_ingress_request_duration_seconds_bucket:sum[5m]))' />
                    </DataSet>

                    <RegionControls/>

                    <Font name='default' url='https://threejs.org/examples/fonts/helvetiker_regular.typeface.json' fallback={true}>
                        <Figure width={1400} height={400}>
                            <Select dataset='ingress'>
                                <Axes position={[0, 0, 1400, 400]}>
                                    <Plot range='dynamic' />
                                    {/* <CurrentValue format={v => `${v.toFixed(2)}s`} /> */}
                                    <Legend fontSize={12} labels={['microservice']} />
                                </Axes>
                            </Select>
                        </Figure>
                    </Font>

                    {/* <Select dataset='ingress'>
                        <List maxLines={30} hoverContextLines={8}/>
                    </Select> */}
                </Region>
            </LokiConfiguration>
        </PrometheusConfiguration>
    );
};

ReactDOM.render(<App />, document.getElementById('root'));
