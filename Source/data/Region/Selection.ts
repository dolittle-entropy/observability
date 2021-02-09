import moment, { isMoment, Moment } from 'moment';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

import { Hover } from './Hover';
import { Selected } from './Selected';

const distinctHover = distinctUntilChanged<Hover>((current, next) => {
    if (!current?.isHovering && !next?.isHovering) return true;
    if (current?.isHovering !== next?.isHovering) return false;
    if (current?.time?.valueOf() !== next?.time?.valueOf()) return false;
    return true;
});

const distinctSelected = distinctUntilChanged<Selected>((current, next) => {
    if (!current?.hasSelected && !next?.hasSelected) return true;
    if (current?.hasSelected !== next?.hasSelected) return false;
    if (current?.from?.valueOf() !== next?.from?.valueOf()) return false;
    if (current?.to?.valueOf() !== next?.to?.valueOf()) return false;
    return true;
});

export class Selection {
    constructor() {
        this._hover = new BehaviorSubject({ isHovering: false, time: moment() });
        this._selected = new BehaviorSubject({ hasSelected: false, from: moment(), to: moment() });

        this.hover = this._hover.pipe(distinctHover);
        this.selected = this._selected.pipe(distinctSelected);
    }

    private readonly _hover: BehaviorSubject<Hover>;
    private readonly _selected: BehaviorSubject<Selected>;

    readonly hover: Observable<Hover>;
    readonly selected: Observable<Selected>;

    setHover(isHovering: boolean, time?: Moment): void {
        this._hover.next({
            isHovering,
            time: isMoment(time) ? time : this._hover.value.time,
        });
    }

    setSelected(hasSelected: boolean, from?: Moment, to?: Moment) {
        this._selected.next({
            hasSelected,
            from: isMoment(from) ? from : this._selected.value.from,
            to: isMoment(to) ? to : this._selected.value.to,
        });
    }
}
