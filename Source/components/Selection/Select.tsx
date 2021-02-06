import React from 'react';

import { Selector } from './Selector';
import { SelectorPredicate } from './SelectorPredicate';

import { SelectProps } from './Select.props';

export const Select = (props: SelectProps): JSX.Element => {
    const predicate: SelectorPredicate = (data) => props.dataset !== undefined ? data.series.dataset === props.dataset : true;

    return (
        <Selector predicate={predicate}>
            { props.children }
        </Selector>
    );
};
