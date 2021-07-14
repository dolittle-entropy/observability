import React from 'react';
import { useContext, useEffect, useState } from 'react';

import { Font as ThreeFont, FontLoader } from 'three';

import { FontsContext } from './Fonts.context';
import { FontProps } from './Font.props';

const loader = new FontLoader();

export const Font = (props: FontProps): JSX.Element => {
    const parent = useContext(FontsContext);

    const [font, setFont] = useState<ThreeFont>();
    useEffect(() => {
        if (props.json !== undefined) {
            const font = loader.parse(props.json);
            setFont(font);
        } else if (props.url !== undefined) {
            loader.load(props.url, (font) => {
                setFont(font);
            });
        } else {
            setFont(undefined);
        }
    }, [props.json, props.url]);

    let context = parent;
    if (font !== undefined) {
        context = Object.assign({}, parent);
        context.named[props.name] = font;
        if (props.fallback === true) {
            context.fallback = font;
        }
    }

    return (
        <FontsContext.Provider value={context}>
            { props.children }
        </FontsContext.Provider>
    );
};
