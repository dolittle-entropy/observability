import React, { FormEvent } from 'react';
import { DatePicker, MaskedTextField, Stack } from '@fluentui/react';
import moment, { Moment } from 'moment';

import { TimeFormat } from './Controls';

import { AbsoluteControlsProps } from './AbsoluteControls.props';

const validateTimeTextField = (value: string): boolean =>
    value.includes('_') ? false : moment(value, TimeFormat).isValid();

const getTimeTextFieldErrorMessage = (value: string): string =>
    value.includes('_') ? '' :
    validateTimeTextField(value) ? '' : 'Not a valid time';

const onSelectDate = (from: Moment, to: Moment, set: (from: Moment, to: Moment) => void, n: number): (date: Date) => void => {
    const args: Moment[] = [moment(from), moment(to)];
    return (date): void => {
        args[n].year(date.getFullYear()).month(date.getMonth()).date(date.getDate());
        set(args[0], args[1]);
    };
};

const onChangeTime = (from: Moment, to: Moment, set: (from: Moment, to: Moment) => void, n: number): (_: FormEvent<HTMLInputElement>, value: string) => void => {
    const args: Moment[] = [moment(from), moment(to)];
    return (_, value): void => {
        if (!validateTimeTextField(value)) return;
        const time = moment(value, TimeFormat);
        args[n].hour(time.hour()).minute(time.minute()).second(time.second());
        set(args[0], args[1]);
    };
};

export const AbsoluteControls = (props: AbsoluteControlsProps): JSX.Element => {
    const { from, to, setAbsolute } = props;

    return (
        <Stack tokens={{ padding: 20 }}>
            <Stack horizontal tokens={{ childrenGap: 10 }}>
                <DatePicker
                    label='From:'
                    value={from.toDate()}
                    onSelectDate={onSelectDate(from, to, setAbsolute, 0)}
                />
                <MaskedTextField
                    label='&nbsp;'
                    iconProps={{ iconName: 'Clock' }}
                    mask='99:99:99'
                    value={from.format(TimeFormat)}
                    onGetErrorMessage={getTimeTextFieldErrorMessage}
                    onChange={onChangeTime(from, to, setAbsolute, 0)}
                    />
            </Stack>
            <Stack horizontal tokens={{ childrenGap: 10 }}>
                <DatePicker
                    label='To:'
                    value={to.toDate()}
                    onSelectDate={onSelectDate(from, to, setAbsolute, 1)}
                />
                <MaskedTextField
                    label='&nbsp;'
                    iconProps={{ iconName: 'Clock' }}
                    mask='99:99:99'
                    value={to.format(TimeFormat)}
                    onGetErrorMessage={getTimeTextFieldErrorMessage}
                    onChange={onChangeTime(from, to, setAbsolute, 1)}
                />
            </Stack>
        </Stack>
    )
};
