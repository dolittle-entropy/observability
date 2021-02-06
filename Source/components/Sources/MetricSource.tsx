import { useRegion } from 'components/Region';

import { MetricSourceProps } from './MetricSource.props';
import { useSource } from './useSource';

export const MetricSource = (props: MetricSourceProps): JSX.Element => {
    const region = useRegion();

    useSource(region.metrics, props.source, (series, dataset, labels) => ({ ...series, dataset, labels }));

    return null;
};
