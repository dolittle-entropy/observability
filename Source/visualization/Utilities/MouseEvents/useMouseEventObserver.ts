import { useEffect } from 'react';
import { useConst } from '@fluentui/react-hooks';
import { Subject } from 'rxjs';

import { MouseEvent } from './MouseEvent';
import { MouseEventObservable } from './MouseEventObservable';

export const useMouseEventObserver = (element?: HTMLElement | SVGElement): MouseEventObservable => {
    const subject = useConst(new Subject<MouseEvent>())

    useEffect(() => {
        if (!element) return;

        const down = (event: globalThis.MouseEvent) => subject.next({ type: 'mousedown', event });
        const enter = (event: globalThis.MouseEvent) => subject.next({ type: 'mouseenter', event });
        const leave = (event: globalThis.MouseEvent) => subject.next({ type: 'mouseleave', event });
        const move = (event: globalThis.MouseEvent) => subject.next({ type: 'mousemove', event });
        const up = (event: globalThis.MouseEvent) => subject.next({ type: 'mouseup', event });

        element.addEventListener('mousedown', down);
        element.addEventListener('mouseenter', enter);
        element.addEventListener('mouseleave', leave);
        element.addEventListener('mousemove', move);
        element.addEventListener('mouseup', up);
        
        return () => {
            element.removeEventListener('mousedown', down);
            element.removeEventListener('mouseenter', enter);
            element.removeEventListener('mouseleave', leave);
            element.removeEventListener('mousemove', move);
            element.removeEventListener('mouseup', up);
        };
    }, [element]);

    return subject;
};
