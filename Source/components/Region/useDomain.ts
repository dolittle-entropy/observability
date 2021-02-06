import { Duration, Moment } from 'moment';

import { useObservable } from 'components/Utilities/Reactive';

import { useRegion } from './useRegion';

type SetAbsoluteDomain = (from: Moment, to: Moment) => void;

type SetRelativeDomain = (last: Duration, refresh: Duration) => void;

type Domain = {
    readonly from: Moment;
    readonly to: Moment;
    readonly last: Duration;
    readonly refresh: Duration;
    readonly isRelative: boolean;
    readonly setAbsolute: SetAbsoluteDomain;
    readonly setRelative: SetRelativeDomain;
};


export const useDomain = (): Domain => {
    const region = useRegion();

    const [from, to] = useObservable(region.domain.absolute) ?? [];
    const {last, refresh} = useObservable(region.domain.relative) ?? {};
    const isRelative = useObservable(region.domain.isRelative);

    const setAbsolute: SetAbsoluteDomain = (from, to) => region.domain.setAbsolute(from, to);
    const setRelative: SetRelativeDomain = (last, refresh) => region.domain.setRelative(last, refresh);

    return { from, to, last, refresh, isRelative, setAbsolute, setRelative };
};
