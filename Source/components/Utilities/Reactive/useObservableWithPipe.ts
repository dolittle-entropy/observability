import { useEffect, useState } from 'react';
import { Observable, OperatorFunction } from 'rxjs';

import { ObservableTransform } from './ObservableTransform';
import { useObservableWithTransform } from './useObservableWithTransform';

export const useObservableWithPipe = <T, U>(observable: Observable<T>, operator: OperatorFunction<T,U>): U => {
    const [[transform], setTransform] = useState<[ObservableTransform<T,U>]>([(observable) => observable.pipe(operator)]);
    useEffect(() => {
        setTransform([(observable) => observable.pipe(operator)]);
    }, [operator]);

    return useObservableWithTransform(observable, transform);
};
