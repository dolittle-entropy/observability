import { createContext } from 'react';

import { Fonts } from './Fonts';

export const FontsContext = createContext<Fonts>({
    fallback: undefined,
    named: {},
});
