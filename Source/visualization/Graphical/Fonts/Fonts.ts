import { Font } from 'three';

export type Fonts = {
    fallback?: Font;
    named: { [name: string]: Font };
}
