import { useConst } from '@fluentui/react-hooks';
import { RefObject, useEffect } from 'react';
import { BehaviorSubject, Observable } from 'rxjs';

import { Measurement } from './Measurement';

export const useMeasuringObservable = <T extends Element, U extends Element>(observe: RefObject<T>, measure?: RefObject<U>): Observable<Measurement> => {
    const subject = useConst(() => new BehaviorSubject<Measurement>({ width: 0, height: 0 }));

    useEffect(() => {
        if (!observe.current || (measure !== undefined && !measure.current)) return;
        const toMeasure = measure?.current ?? observe.current;
        
        const observer = new ResizeObserver(() => subject.next({ width: toMeasure.clientWidth, height: toMeasure.clientHeight }));

        observer.observe(observe.current);
        return () => observer.disconnect();

    }, [ observe.current, measure?.current ])

    return subject;
};
