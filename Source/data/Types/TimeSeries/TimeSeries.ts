import { Labels } from 'data/Types/Labels';

import { DataSet } from './DataSet';
import { Name } from './Name';
import { Timestamp } from './Timestamp';

export type TimeSeries<T> = {
    readonly name: Name;
    readonly dataset: DataSet;
    readonly labels: Labels;
    readonly times: readonly Timestamp[];
    readonly values: readonly T[];
};
