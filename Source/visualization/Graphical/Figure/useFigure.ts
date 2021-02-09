import { useContext } from 'react';

import { FigureContext } from './Figure.context';
import { FigureSvg } from './FigureSvg';

export const useFigure = (): FigureSvg =>
    useContext(FigureContext);
