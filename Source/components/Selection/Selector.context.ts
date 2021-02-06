import { createContext } from 'react';

import { SelectorPredicate } from './SelectorPredicate';

const defaultSelector: SelectorPredicate = () => true;

export const SelectorContext = createContext<SelectorPredicate>(defaultSelector);
