import { useRegion } from 'components/Region';

import { LogSourceProps } from './LogSource.props';
import { useSource } from './useSource';

export const LogSource = (props: LogSourceProps): JSX.Element => {
    const region = useRegion();

    useSource(region.logs, props.source, (series, dataset, labels) => ({ ...series, dataset, labels }));

    return null;
};
