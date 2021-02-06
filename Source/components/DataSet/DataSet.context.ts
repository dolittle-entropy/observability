import { createContext } from 'react';

import { DataSet } from '@dolittle/observability.data/Types/TimeSeries';

import { Labels } from './Labels';

export const DataSetContext = createContext<[DataSet, Labels]>(['', {}]);
