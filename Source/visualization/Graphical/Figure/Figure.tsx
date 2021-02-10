import React, { createRef, useState } from 'react';
import { useRefEffect } from '@fluentui/react-hooks';
import { select } from 'd3';

import { Axes } from 'visualization/Graphical/Axes';
import { useMeasuringObserver } from 'visualization/Utilities/Measuring';

import { FigureProps } from './Figure.props';
import { FigureContext } from './Figure.context';
import { FigureSvg } from './FigureSvg';


const dimensionToStyle = (dimension?: number | string): string => {
    switch (typeof dimension) {
        case 'number':
            return `${dimension}px`;
        case 'string':
            return dimension;
        default:
            return '100%';
    }
}

export const Figure = (props: FigureProps): JSX.Element => {
    const [selection, setSelection] = useState<FigureSvg>();

    const bounding = createRef<HTMLDivElement>();
    const figure = useRefEffect<SVGSVGElement>((figure) => {
        if (!figure) setSelection(null);
        setSelection(select(figure));
    });

    const { width, height } = useMeasuringObserver(bounding, figure);

    return (
        <div ref={bounding} style={{ width: dimensionToStyle(props.width), height: dimensionToStyle(props.height) }}>
            <svg ref={figure} style={{ width: '100%', height: '100%', userSelect: 'none' }} viewBox={`0, 0, ${width}, ${height}`}>
                {
                    !!selection && width && height &&
                    <FigureContext.Provider value={selection}>
                        <Axes position={[0, 0, width, height]}>
                            { props.children }
                        </Axes>
                    </FigureContext.Provider>
                }
            </svg>
        </div>
    );
}