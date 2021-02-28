import { useContext } from 'react';
import { Scene } from 'three';

import { useFigure } from 'visualization/Graphical/Figure';

import { PositionContext } from './Axes.context';

export const useAxes = (): { x: number, y: number, width: number, height: number, figure: Scene, canvas: HTMLCanvasElement, figureWidth: number, figureHeight: number } => {
    const {figure, canvas, width: figureWidth, height: figureHeight} = useFigure();
    const [x, y, width, height] = useContext(PositionContext);
    return { x, y, width, height, figure, canvas, figureWidth, figureHeight };
};
