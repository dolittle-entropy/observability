import React from 'react';
import ReactDOM from 'react-dom';

import './theme/theme';
import './index.scss';

import { Region } from '@dolittle/observability.components/Region';
import { Controls } from '@dolittle/observability.components/Region/Controls';

// import { Timeseries, printHello } from '@dolittle/observability.data/Timeseries/Timeseries';

// const test: Timeseries = 1;
// printHello();

const App = (): JSX.Element => {
    return (
        <Region>
            <Controls/>
            <div>Hello world</div>
        </Region>
    );
};

ReactDOM.render(<App />, document.getElementById('root'));
