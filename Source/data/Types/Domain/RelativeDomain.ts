import { Duration } from 'moment';

export type RelativeDomain = { 
    readonly last: Duration;
    readonly refresh: Duration
};
