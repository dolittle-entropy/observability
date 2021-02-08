import React from 'react';

import { PositionContext } from './Axes.context';
import { AxesProps } from './Axes.props';

export const Axes = (props: AxesProps): JSX.Element => {
    return (
        <PositionContext.Provider value={props.position}>
            { props.children }
        </PositionContext.Provider>
    );
};
