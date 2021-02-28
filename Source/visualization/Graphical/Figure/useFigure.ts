import { useContext } from 'react';
import { Scene } from 'three';

import { FigureContext } from './Figure.context';

export const useFigure = (): { figure: Scene, canvas: HTMLCanvasElement, width: number, height: number } =>
    useContext(FigureContext);
