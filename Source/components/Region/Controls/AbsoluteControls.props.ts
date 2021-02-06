import { Moment } from 'moment';

export type AbsoluteControlsProps = {
    from: Moment;
    to: Moment;
    setAbsolute: (from: Moment, to: Moment) => void;
};
