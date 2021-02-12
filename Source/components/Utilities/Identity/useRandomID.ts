import { useConst } from '@fluentui/react-hooks';

import { generateRandomID } from './generateRandomID';

export const useRandomID = (): string =>
    useConst(generateRandomID);
