import React from 'react';
import { Pivot, PivotItem } from '@fluentui/react';

import { AbsoluteControls } from './AbsoluteControls';
import { RelativeControls } from './RelativeControls';
import { DomainControlsProps } from './DomainControls.props';

export const DomainControls = (props: DomainControlsProps): JSX.Element => {
    const { isRelative, from, to, last, refresh, setAbsolute, setRelative } = props;

    const OnChangeAbsoluteRelative = (item: PivotItem) => {
        if (item.props.itemKey === 'absolute') setAbsolute(from, to);
        else setRelative(last, refresh);
    };

    return (
        <Pivot selectedKey={ isRelative ? 'relative' : 'absolute' } onLinkClick={OnChangeAbsoluteRelative}>
            <PivotItem itemKey='absolute' headerText='Absolute'>
                <AbsoluteControls from={from} to={to} setAbsolute={setAbsolute} />
            </PivotItem>
            <PivotItem itemKey='relative' headerText='Relative'>
                <RelativeControls last={last} refresh={refresh} setRelative={setRelative} />
            </PivotItem>
        </Pivot>
    );
};
