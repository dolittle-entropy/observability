import { ReactNode } from 'react';

import { Configuration } from './Configuration';

export type ProviderProps = Configuration & { children?: ReactNode };
