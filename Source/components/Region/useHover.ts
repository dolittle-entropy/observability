import { Moment } from 'moment';

import { useObservable } from 'components/Utilities/Reactive';

import { useRegion } from './useRegion';

type SetHover = (isHovering: boolean, time?: Moment) => void;

type Hover = {
    readonly isHovering: boolean;
    readonly time: Moment;
    readonly setHover: SetHover;
};

export const useHover = (): Hover => {
    const region = useRegion();

    const { isHovering, time } = useObservable(region.selection.hover) ?? {};

    const setHover: SetHover = (isHovering, time?) => region.selection.setHover(isHovering, time);

    return { isHovering, time, setHover };
};
