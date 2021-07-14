import { FontName } from 'visualization/Graphical/Fonts';

export type CurrentValueProps = {
    format?: (value: number) => string;
    font?: FontName;
    fontSize?: number;
    spacing?: number;
};
