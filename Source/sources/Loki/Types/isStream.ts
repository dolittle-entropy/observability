import { Stream } from './Stream';

export const isStream = (obj: unknown): obj is Stream =>
    !Object.values(obj).some(_ => typeof _ !== 'string');
