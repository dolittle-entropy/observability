import { hasOwnProperty } from '@dolittle/observability.data/Utilities/Typing';

import { isStreamDataArray } from './isStreamDataArray';
import { StreamingResponse } from './StreamingResponse';

export const isStreamingResponse = (obj: unknown): obj is StreamingResponse =>
    typeof obj === 'object' &&
    hasOwnProperty(obj, 'streams') &&
    isStreamDataArray(obj.streams);
