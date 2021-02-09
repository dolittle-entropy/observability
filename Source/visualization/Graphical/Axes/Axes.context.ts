import { createContext } from 'react';

import { AxesPosition } from './AxesPosition';

export const PositionContext = createContext<AxesPosition>([0, 0, 0, 0]);
