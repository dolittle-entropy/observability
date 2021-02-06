import { Duration } from 'moment';

export type RelativeControlsProps = {
    last: Duration;
    refresh: Duration;
    setRelative: (last: Duration, refresh: Duration) => void;
};
