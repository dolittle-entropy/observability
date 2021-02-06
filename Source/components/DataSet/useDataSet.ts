
import { useContext } from 'react';

import { DataSet } from '@dolittle/observability.data/Types/TimeSeries';

import { DataSetContext } from './DataSet.context';
import { Labels } from './Labels';

export const useDataSet = (): [DataSet, Labels] =>
    useContext(DataSetContext);
