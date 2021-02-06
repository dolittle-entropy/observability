import { ScalarData } from './ScalarData';
import { StringData } from './StringData';

export const isScalarOrStringData = (obj: unknown): obj is ScalarData | StringData =>
    Array.isArray(obj) &&
    obj.length === 2 &&
    typeof obj[0] === 'number' &&
    typeof obj[1] === 'string';
