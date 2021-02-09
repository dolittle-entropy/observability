import React from 'react';

import { Axes, useAxes } from 'visualization/Graphical/Axes';

import { HorizontalProps } from './Horizontal.props';
import { ForEach } from '../ForEach';


export const Horizontal = (props: HorizontalProps): JSX.Element => {
    const { x, y, width, height } = useAxes();

    return (
        <ForEach groupBy={props.groupBy} render={(n, count) => {
            const cwidth = (width - 10*count+1)/count;
            const cx = x+10+(cwidth+10)*n;
            return (
                <Axes position={[cx, y, cwidth, height]}>
                    { props.children }
                </Axes>
            );
        }} />
    )
};
