import { createContext } from 'react';
import { Scene } from 'three';

export const FigureContext = createContext<{ figure: Scene, canvas: HTMLCanvasElement, width: number, height: number }>(null);
