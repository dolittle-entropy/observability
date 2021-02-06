import React, { useContext } from 'react';

import { SelectorPredicate } from './SelectorPredicate';

import { SelectorProps } from './Selector.props';
import { SelectorContext } from './Selector.context';

export const Selector = (props: SelectorProps): JSX.Element => {
    const parent = useContext(SelectorContext);

    const selector: SelectorPredicate = (data) => parent(data) && props.predicate(data);

    return (
        <SelectorContext.Provider value={selector}>
            { props.children }
        </SelectorContext.Provider>
    );
};
