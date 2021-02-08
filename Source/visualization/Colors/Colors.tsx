import React from 'react';

import { Schemes } from 'visualization/Colors/Schemes';

import { ColorsContext } from './Colors.context';
import { ColorsProps } from './Colors.props';
import { useColors } from './useColors';

export const Colors = (props: ColorsProps): JSX.Element => {
    const parent = useColors();

    const sequence =
        typeof props.sequence === 'function' ? props.sequence :
        typeof props.sequence === 'string' && props.sequence in Schemes ? Schemes[props.sequence].sequence :
        parent.sequence;

    const map =
        typeof props.map === 'function' ? props.map :
        typeof props.map === 'string' && props.map in Schemes ? Schemes[props.map].map :
        parent.map;

    return (
        <ColorsContext.Provider value={{ sequence, map }}>
            { props.children }
        </ColorsContext.Provider>
    );
};
