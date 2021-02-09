import { ReactNode } from 'react';

import { LabelName } from '@dolittle/observability.data/Types/Labels';

export type ForEachProps = {
    render: (n: number, count: number) => ReactNode;
    groupBy?: LabelName;
};
