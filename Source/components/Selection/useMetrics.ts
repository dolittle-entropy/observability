import { useObservable } from 'components/Utilities/Reactive';

import { SelectedMetrics } from './SelectedMetrics';
import { useSelectedMetrics } from './useSelectedMetrics';

export const useMetrics = (): SelectedMetrics =>
    useObservable(useSelectedMetrics());
