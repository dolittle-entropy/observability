import { Duration, Moment } from 'moment';

export type DomainControlsProps = {
    isRelative: boolean;
    from: Moment;
    to: Moment;
    last: Duration;
    refresh: Duration;
    setAbsolute: (from: Moment, to: Moment) => void;
    setRelative: (last: Duration, refresh: Duration) => void;
};
