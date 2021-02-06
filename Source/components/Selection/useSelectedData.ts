import { useContext, useEffect, useState } from 'react';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Data } from '@dolittle/observability.data/Region';
import { TimeSeries } from '@dolittle/observability.data/Types/TimeSeries';

import { SelectedData } from './SelectedData';
import { SelectorContext } from './Selector.context';

export const useSelelectedData = <T, U extends TimeSeries<T>>(data: Observable<Data<T,U>[]>): Observable<SelectedData<T,U>> => {
    const selector = useContext(SelectorContext);

    const [observable, setObservable] = useState<Observable<SelectedData<T,U>>>();

    useEffect(() => {
        if (!data || !selector) setObservable(null);

        const selected = data.pipe(
            map(data => data.filter(selector)),
            map(data => ({
                loading: data.some(_ => _.loading),
                series: data.map(_ => _.series),
                errors: [...new Set(data.flatMap(_ => _.errors))],
            })),
        );

        setObservable(selected);
    }, [data, selector]);

    return observable;
};
