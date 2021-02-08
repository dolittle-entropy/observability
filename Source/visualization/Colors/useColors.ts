import { useContext } from 'react';

import { ColorScheme } from 'visualization/Colors/Schemes';

import { ColorsContext } from './Colors.context';

export const useColors = (): ColorScheme =>
    useContext(ColorsContext);
