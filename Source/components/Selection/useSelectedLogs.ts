import { Observable } from 'rxjs';

import { useRegion } from 'components/Region';

import { SelectedLogs } from './SelectedLogs';
import { useSelelectedData } from './useSelectedData';

export const useSelectedLogs = (): Observable<SelectedLogs> =>
    useSelelectedData(useRegion().logs.data);
