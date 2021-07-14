import { ReactNode } from 'react';

import { FontName } from './FontName';

type BaseProps = {
    name: FontName;
    fallback?: boolean;
    children?: ReactNode;
}

type JSONFontProps = BaseProps & {
    json: any;
    url?: never;
}

type URLFontProps = BaseProps & {
    url: string;
    json?: never;
}

export type FontProps = JSONFontProps | URLFontProps;
