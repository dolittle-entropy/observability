import { ReactNode } from 'react';

import { DataSet } from '@dolittle/observability.data/Types/TimeSeries';

export type SelectProps = {
    dataset?: DataSet;
    children?: ReactNode;
}
