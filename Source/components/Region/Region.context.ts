import { createContext } from 'react';

import { Region } from '@dolittle/observability.data/Region';

export const RegionContext = createContext(new Region());