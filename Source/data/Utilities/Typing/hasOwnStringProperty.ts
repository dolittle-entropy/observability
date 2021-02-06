import { hasOwnProperty } from './hasOwnProperty';

export const hasOwnStringProperty = <O extends object, P extends PropertyKey>(obj: O, property: P): obj is O & Record<P, string> =>
    hasOwnProperty(obj, property) && typeof obj[property] === 'string';