import React, { createRef } from 'react';
import { Callout, DefaultButton, DirectionalHint } from '@fluentui/react';
import { useBoolean } from '@fluentui/react-hooks';
import { Duration } from 'moment';

import { useDomain } from 'components/Region';

import { DomainControls } from './DomainControls';

export const DateFormat = 'ddd MMM D YYYY HH:mm:ss';
export const TimeFormat = 'HH:mm:ss';

export const FormatDuration = (duration: Duration): string => {
    const hours = duration?.hours(), minutes = duration?.minutes(), seconds = duration?.seconds(), milliseconds = duration?.milliseconds();
    let text = '';
    if (hours > 0) text += hours + (hours > 1 ? ' hours' : ' hour')
    if (minutes > 0) text += minutes + (minutes > 1 ? ' minutes' : ' minute')
    if (seconds > 0) text += seconds + (seconds > 1 ? ' seconds' : ' second')
    if (milliseconds > 0) text += milliseconds + (milliseconds > 1 ? ' milliseconds' : ' millisecond')
    return text;
}

export const Controls = (): JSX.Element => {
    const { isRelative, from, to, last, refresh, setAbsolute, setRelative } = useDomain();
    
    const container = createRef<HTMLDivElement>();
    const [ showCallout, { toggle: toggleCallout } ] = useBoolean(false);

    if (!from || !to || !last || !refresh || !setAbsolute || !setRelative) return null;

    const buttonText = isRelative
        ? `Last ${FormatDuration(last)} every ${FormatDuration(refresh)}`
        : `${from.format(DateFormat)} - ${to.format(DateFormat)}`;

    return (
        <>
            <div style={{ display: 'inline-block' }} ref={container}>
                <DefaultButton
                    iconProps={{ iconName: 'Clock' }}
                    text={buttonText}
                    onClick={toggleCallout}
                />
            </div>
            { showCallout &&
                <Callout target={container} directionalHint={DirectionalHint.bottomCenter}>
                    <DomainControls isRelative={isRelative} from={from} to={to} last={last} refresh={refresh} setAbsolute={setAbsolute} setRelative={setRelative} />
                </Callout>
            }
        </>
    );
};
