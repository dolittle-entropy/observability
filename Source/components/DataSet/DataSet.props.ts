import { ReactNode } from 'react';

import { DataSet } from '@dolittle/observability.data/Types/TimeSeries';

import { Labels } from './Labels';

export type DataSetProps = {
    name: DataSet;
    labels?: Labels;
    children?: ReactNode;
};
