import { Observable } from 'rxjs';

import { useObservableWithPipe } from './useObservableWithPipe';

const unity = <T>(value: T): T => value;

export const useObservable = <T>(observable: Observable<T>): T =>
    useObservableWithPipe(observable, unity);
