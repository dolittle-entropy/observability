import { useContext } from 'react';

import { Configuration } from './Configuration';
import { merge } from './merge';
import { ConfigurationContext } from './Provider.context';

export const useConfiguration = (configuration: Configuration): Configuration =>
    merge(configuration, useContext(ConfigurationContext));
