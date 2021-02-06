import { useObservable } from 'components/Utilities/Reactive';

import { SelectedLogs } from './SelectedLogs';
import { useSelectedLogs } from './useSelectedLogs';

export const useLogs = (): SelectedLogs =>
    useObservable(useSelectedLogs()) ?? { loading: true, series: [], errors: [] };
