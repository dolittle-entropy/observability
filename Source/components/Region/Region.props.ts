import { ReactNode } from 'react';

import { AbsoluteDomain, RelativeDomain } from '@dolittle/observability.data/Types/Domain';

export type RegionProps = {
    defaultDomain?: AbsoluteDomain | RelativeDomain;
    children?: ReactNode;
};
