import { useEffect, useState } from 'react';
import { Observable } from 'rxjs';

import { ObservableTransform } from './ObservableTransform';

export const useObservableWithTransform = <T, U>(observable: Observable<T>, transform: ObservableTransform<T,U>): U => {
    const [value, setValue] = useState<U>(undefined);

    useEffect(() => {
        if (!observable || !transform) return;

        const transformed = transform(observable);

        const subscription = transformed.subscribe(setValue);

        return () => subscription.unsubscribe();
    }, [observable, transform]);

    return value;
};
