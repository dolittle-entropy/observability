import { Observable } from 'rxjs';

import { useRegion } from 'components/Region';

import { SelectedMetrics } from './SelectedMetrics';
import { useSelelectedData } from './useSelectedData';

export const useSelectedMetrics = (): Observable<SelectedMetrics> =>
    useSelelectedData(useRegion().metrics.data);
