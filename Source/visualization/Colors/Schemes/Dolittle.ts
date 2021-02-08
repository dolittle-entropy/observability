import { interpolateLab } from 'd3';

import { ColorScheme } from './ColorScheme';

export const Dolittle: ColorScheme = {
    sequence: (n: number): string => {
        switch (n % 5) {
            case 0:
                return '#ff4b00';
            case 1:
                return '#004366';
            case 2:
                return '#ffcf00';
            case 3:
                return '#525a63';
            case 4:
                return '#33b9e6';
        }
    },
    map: interpolateLab('#ff4b00', '#004366'),
};
