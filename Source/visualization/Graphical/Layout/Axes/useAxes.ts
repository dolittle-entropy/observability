import { useContext } from 'react';

import { FigureSvg, useFigure } from 'visualization/Graphical/Layout/Figure';

import { PositionContext } from './Axes.context';

export const useAxes = (): { x: number, y: number, width: number, height: number, figure: FigureSvg } => {
    const figure = useFigure();
    const [x, y, width, height] = useContext(PositionContext);
    return { x, y, width, height, figure };
};
