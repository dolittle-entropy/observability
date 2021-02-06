import React from 'react';

import { ConfigurationContext } from './Provider.context';
import { ProviderProps } from './Provider.props';
import { useConfiguration } from './useConfiguration';

export const Provider = (props: ProviderProps): JSX.Element => {
    const configuration = useConfiguration(props);

    return (
        <ConfigurationContext.Provider value={configuration}>
            { props.children }
        </ConfigurationContext.Provider>
    );
};
