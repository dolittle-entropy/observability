import { Observable } from 'rxjs';

export type ObservableTransform<T, U> = (observable: Observable<T>) => Observable<U>;
