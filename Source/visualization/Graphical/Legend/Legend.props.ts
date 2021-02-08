import { LabelName } from '@dolittle/observability.data/Types/Labels';

export type LegendProps = {
    labels?: LabelName[] | ((name: LabelName) => boolean);
};
