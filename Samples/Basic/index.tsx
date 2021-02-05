import React from 'react';
import ReactDOM from 'react-dom';

import './theme/theme';
import './index.scss';

// import { Timeseries, printHello } from '@dolittle/observability.data/Timeseries/Timeseries';

// const test: Timeseries = 1;
// printHello();

const App = (): JSX.Element => {
    return (
        <div>Hello world</div>
    );
};

ReactDOM.render(<App />, document.getElementById('root'));
