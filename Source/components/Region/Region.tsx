import React from 'react';
import { useConst } from '@fluentui/react-hooks';

import { Region as ActualRegion } from '@dolittle/observability.data/Region';

import { RegionProps } from './Region.props';
import { RegionContext } from './Region.context';

export const Region = (props: RegionProps): JSX.Element => {
    const region = useConst(() => new ActualRegion(props.defaultDomain));

    return (
        <RegionContext.Provider value={region}>
            { props.children }
        </RegionContext.Provider>
    );
};
