import React, { FormEvent } from 'react';
import { Dropdown, IDropdownOption, Stack } from '@fluentui/react';
import { Duration, duration } from 'moment';

import { FormatDuration } from './Controls';

import { RelativeControlsProps } from './RelativeControls.props';

const RangeOptions = [
    duration(5, 'minutes'),
    duration(15, 'minutes'),
    duration(30, 'minutes'),
    duration(1, 'hour'),
    duration(3, 'hours'),
];

const RefreshOptions = [
    duration(5, 'seconds'),
    duration(10, 'seconds'),
    duration(1, 'minute'),
];

const findOrInsertDuration = (options: Duration[], selected: Duration): [number, Duration[]] => {
    const index = options.findIndex(duration => duration.asMilliseconds() >= selected.asMilliseconds());
    if (index < 0) {
        return [options.length, options.concat(selected)];
    } else if (options[index].asMilliseconds() === selected.asMilliseconds()) {
        return [index, options];
    } else {
        const copy = options.slice();
        copy.splice(index, 0, selected);
        return [index, copy];
    }
};

const durationsToOptions = (prefix: string, durations: Duration[]): IDropdownOption[] =>
    durations.map((duration, index) => ({
        key: index,
        data: duration,
        text: `${prefix}${FormatDuration(duration)}`,
    }));

const onSelectedRangeChange = (refresh: Duration, set: (last: Duration, refresh: Duration) => void): (_: FormEvent<HTMLDivElement>, option: IDropdownOption) => void => {
    return (_, option) => set(option.data, refresh);
};

const onSelectedRefreshChange = (last: Duration, set: (last: Duration, refresh: Duration) => void): (_: FormEvent<HTMLDivElement>, option: IDropdownOption) => void => {
    return (_, option) => set(last, option.data);
};

export const RelativeControls = (props: RelativeControlsProps): JSX.Element => {
    const { last, refresh, setRelative } = props;

    const [ selectedRangeIndex, rangeOptions ] = findOrInsertDuration(RangeOptions, last);
    const [ selectedRefreshIndex, refreshOptions ] = findOrInsertDuration(RefreshOptions, refresh);

    return (
        <Stack tokens={{ padding: 20 }}>
            <Stack horizontal tokens={{ childrenGap: 10 }}>
                <Dropdown
                    label='Range:'
                    options={durationsToOptions('Last ', rangeOptions)}
                    selectedKey={selectedRangeIndex}
                    onChange={onSelectedRangeChange(refresh, setRelative)}
                />
                <Dropdown
                    label='Refresh:'
                    options={durationsToOptions('Every ', refreshOptions)}
                    selectedKey={selectedRefreshIndex}
                    onChange={onSelectedRefreshChange(last, setRelative)}
                />
            </Stack>
        </Stack>
    )
};
