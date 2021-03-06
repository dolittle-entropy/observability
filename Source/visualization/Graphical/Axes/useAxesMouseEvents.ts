import { useEffect, useRef } from 'react';
import { useConst } from '@fluentui/react-hooks';
import { merge, Observable, partition, Subject } from 'rxjs';
import { filter, map, scan } from 'rxjs/operators';

import { MouseEvent, useMouseEventObserver } from 'visualization/Utilities/MouseEvents';

import { useAxes } from './useAxes';
import { pointer } from 'd3';
import { AxesMouseEvent } from './AxesMouseEvent';

type AxesHitTest = (event: MouseEvent) => AxesMouseEvent & { readonly inside: boolean };

const createHitTest = (x: number, y: number, width: number, height: number, element?: SVGSVGElement): AxesHitTest =>
    element === undefined
    ? (event) => ({ ...event, inside: false, x: 0, y: 0 })
    : (event) => {
        const [mouseX, mouseY] = pointer(event.event, element);
        const inside = mouseX >= x && mouseX <= x+width && mouseY >= y && mouseY <= y+height;
        return ({ ...event, inside, x: mouseX, y: mouseY });
    };

export const useAxesMouseEvents = (): Observable<AxesMouseEvent> => {
    const { figure, x, y, width, height } = useAxes();
    const observable = useMouseEventObserver(figure?.node())

    const hitTest = useRef<AxesHitTest>();
    useEffect(() => {
        hitTest.current = createHitTest(x, y, width, height, figure?.node());
    }, [figure, x, y, width, height])

    const filtered = useConst(new Subject<AxesMouseEvent>());
    useEffect(() => {
        if (!observable) return;

        const [updown, moves] = partition(
            observable.pipe(map((event) => hitTest.current(event))),
            ({ type }) => type === 'mousedown' || type === 'mouseup',
        );

        const merged = merge(
            updown.pipe(
                filter(({inside}) => inside),
            ),
            moves.pipe(
                scan(({ inside: previousInside }, { type, event, inside, x, y }) => {
                    if (!previousInside && inside) {
                        return { type: 'mouseenter', event, inside, x, y, emit: true };
                    } else if (previousInside && !inside) {
                        return { type: 'mouseleave', event, inside, x, y, emit: true };
                    }
                    return { type, event, inside, x, y, emit: inside };
                }, { type: '', event: null, x: 0, y: 0, inside: false, emit: false }),
                filter(({ emit }) => emit),
            ),
        ).pipe(
            map(({ type, event, x, y }) => ({ type, event, x, y })),
        );

        const subscription = merged.subscribe(filtered);
        return () => subscription.unsubscribe();
    }, [observable]);

    return filtered;
};
