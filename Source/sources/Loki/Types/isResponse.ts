import { hasOwnProperty, hasOwnStringProperty } from '@dolittle/observability.data/Utilities/Typing';

import { isData } from './isData';
import { Response } from './Response';

const isWarnings = (obj: unknown): obj is string[] =>
    Array.isArray(obj) &&
    !obj.some(_ => typeof _ !== 'string');

export const isResponse = (obj: unknown): obj is Response => {
    if (typeof obj !== 'object') return false;
    if (!hasOwnProperty(obj, 'status')) return false;
    if (hasOwnProperty(obj, 'warnings') && !isWarnings(obj.warnings)) return false;
    switch (obj.status) {
        case 'success':
            if (!hasOwnProperty(obj, 'data') || !isData(obj.data)) return false;
            return true;
        case 'error':
            if (!hasOwnStringProperty(obj, 'errorType')) return false;
            if (!hasOwnStringProperty(obj, 'error')) return false;
            if (hasOwnProperty(obj, 'data') && !isData(obj.data)) return false;
            return true;
        default:
            return false;
    }
};
