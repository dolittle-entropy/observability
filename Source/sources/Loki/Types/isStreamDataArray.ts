import { hasOwnProperty } from '@dolittle/observability.data/Utilities/Typing';

import { isStream } from './isStream';
import { StreamData } from './StreamData';

export const isStreamDataArray = (obj: unknown): obj is StreamData[] =>
    Array.isArray(obj) && !obj.some((_: unknown) => {
        if (typeof _ !== 'object') return false;
        if (!hasOwnProperty(_, 'stream') || !isStream(_.stream)) return false;
        if (!hasOwnProperty(_, 'values') || !Array.isArray(_.values)) return false;
        return !_.values.some((_: unknown) => {
            return Array.isArray(_) && _.length === 2 && typeof _[0] === 'string' && typeof _[1] === 'string';
        });
    });
