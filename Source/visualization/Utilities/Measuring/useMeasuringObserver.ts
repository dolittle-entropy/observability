import { RefObject, useEffect, useState } from 'react';

export const useMeasuringObserver = <T extends Element, U extends Element>(observe: RefObject<T>, measure?: RefObject<U>): { width: number, height: number } => {
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);

    useEffect(() => {
        if (!observe.current || (measure !== undefined && !measure.current)) return;
        const toMeasure = measure?.current ?? observe.current;
        
        const observer = new ResizeObserver(() => {
            setWidth(toMeasure.clientWidth);
            setHeight(toMeasure.clientHeight);
        });

        observer.observe(observe.current);
        return () => observer.disconnect();

    }, [ observe.current, measure?.current ])

    return {
        width: width,
        height: height,
    };
};
