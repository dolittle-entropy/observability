import { ReactNode } from 'react';

import { ColorMap } from './ColorMap';
import { ColorSequence } from './ColorSequence';
import { ColorSchemeList } from './Schemes';

export type ColorsProps = {
    sequence?: keyof ColorSchemeList | ColorSequence;
    map?: keyof ColorSchemeList | ColorMap;
    children?: ReactNode;
}