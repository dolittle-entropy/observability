import { useContext } from 'react';

import { Font } from 'three';

import { FontName } from './FontName';
import { FontsContext } from './Fonts.context';

export const useFont = (name: FontName | undefined): Font | undefined => {
    const { fallback, named } = useContext(FontsContext);
    if (name !== undefined && named[name] !== undefined) {
        return named[name];
    }
    return fallback;
};
