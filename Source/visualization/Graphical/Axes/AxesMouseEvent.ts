import { MouseEvent } from 'visualization/Utilities/MouseEvents';

export type AxesMouseEvent = MouseEvent & {
    readonly x: number;
    readonly y: number;
};
