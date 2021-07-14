import { LabelName } from '@dolittle/observability.data/Types/Labels';

import { FontName } from 'visualization/Graphical/Fonts';

export type LegendPosition =
    'top' | 'right' | 'bottom' | 'left' | 'center' |
    'topleft' | 'topcenter' | 'topright' |
    'middleleft' | 'middlecenter' | 'middleright' |
    'bottomleft' | 'bottomcenter' | 'bottomright';

export type LegendProps = {
    labels?: LabelName[] | ((name: LabelName) => boolean);
    font?: FontName;
    fontSize?: number;
    padding?: number;
    position?: LegendPosition;
};
