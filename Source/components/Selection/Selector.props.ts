import { ReactNode } from 'react';

import { SelectorPredicate } from './SelectorPredicate';

export type SelectorProps = {
    predicate: SelectorPredicate;
    children?: ReactNode;
};
