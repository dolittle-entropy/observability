import { useContext } from 'react';

import { Region } from '@dolittle/observability.data/Region';

import { RegionContext } from './Region.context';

export const useRegion = (): Region =>
    useContext(RegionContext);
