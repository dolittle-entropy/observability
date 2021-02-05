export const hasOwnProperty = <O extends object, P extends PropertyKey>(obj: O, property: P): obj is O & Record<P, unknown> =>
    Object.prototype.hasOwnProperty.call(obj, property);
