import moment, { Duration, duration, Moment } from 'moment';
import { BehaviorSubject, Observable, combineLatest, timer, EMPTY } from 'rxjs';
import { distinctUntilChanged, map, switchMap } from 'rxjs/operators';

import { AbsoluteDomain, isAbsoluteDomain, isRelativeDomain, RelativeDomain } from 'data/Types/Domain';

const defaultRelativeDomain: RelativeDomain = { last: duration(1, 'hours'), refresh: duration(5, 'seconds') };

const createInitialDomain = (initial?: AbsoluteDomain | RelativeDomain): [AbsoluteDomain, RelativeDomain, boolean] => {
    if (isAbsoluteDomain(initial)) {
        return [initial, defaultRelativeDomain, false];
    }
    const relative = isRelativeDomain(initial) ? initial : defaultRelativeDomain;
    return [[moment().subtract(relative.last), moment()], relative, true];
}

const distinctAbsoluteDomain = distinctUntilChanged<AbsoluteDomain>((current, next) => {
    if (current?.[0]?.valueOf() !== next?.[0]?.valueOf()) return false;
    if (current?.[1]?.valueOf() !== next?.[1]?.valueOf()) return false;
    return true;
});

const distinctRelativeDomain = distinctUntilChanged<RelativeDomain>((current, next) => {
    if (current?.last?.asMilliseconds() !== next?.last?.asMilliseconds()) return false;
    if (current?.refresh?.asMilliseconds() !== next?.refresh?.asMilliseconds()) return false;
    return true;
});

const distinctIsRelative = distinctUntilChanged<boolean>();

export class Domain {
    constructor(initial?: AbsoluteDomain | RelativeDomain) {
        const [absolute, relative, isRelative] = createInitialDomain(initial);
        this._absolute = new BehaviorSubject(absolute);
        this._relative = new BehaviorSubject(relative);
        this._isRelative = new BehaviorSubject(isRelative);

        this.absolute = this._absolute.pipe(distinctAbsoluteDomain);
        this.relative = this._relative.pipe(distinctRelativeDomain);
        this.isRelative = this._isRelative.pipe(distinctIsRelative);

        this.refreshAbsoluteDomainWhenIsRelative();
    }

    private readonly _absolute: BehaviorSubject<AbsoluteDomain>;
    private readonly _relative: BehaviorSubject<RelativeDomain>;
    private readonly _isRelative: BehaviorSubject<boolean>;

    private refreshAbsoluteDomainWhenIsRelative() {
        combineLatest([this.relative, this.isRelative]).pipe(
            switchMap(([{last, refresh}, isRelative]) => {
                if (isRelative) {
                    return timer(0, refresh.asMilliseconds()).pipe(
                        map(() => [moment().subtract(last), moment()] as [Moment, Moment])
                    );
                }
                return EMPTY;
            })
        ).subscribe(this._absolute);
    }

    readonly absolute: Observable<AbsoluteDomain>;
    readonly relative: Observable<RelativeDomain>;
    readonly isRelative: Observable<boolean>;

    setAbsolute(from: Moment, to: Moment): void {
        this._isRelative.next(false);
        this._absolute.next([from, to]);
    }

    setRelative(last: Duration, refresh: Duration): void {
        this._relative.next({ last, refresh });
        this._isRelative.next(true);
    }
}
