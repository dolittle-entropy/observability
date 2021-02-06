import { Moment } from 'moment';

import { useObservable } from 'components/Utilities/Reactive';

import { useRegion } from './useRegion';

type SetSelected = (hasSelected: boolean, from?: Moment, to?: Moment) => void;

type Selected = {
    readonly hasSelected: boolean;
    readonly from: Moment;
    readonly to: Moment;
    readonly setSelected: SetSelected;
};

export const useSelected = (): Selected => {
    const region = useRegion();

    const { hasSelected, from, to } = useObservable(region.selection.selected) ?? {};

    const setSelected: SetSelected = (hasSelected, from?, to?) => region.selection.setSelected(hasSelected, from, to);

    return { hasSelected, from, to, setSelected };
};
