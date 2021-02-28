import { RefObject, useEffect, useState } from 'react';
import { useObservable } from 'visualization/../components/Utilities/Reactive';
import { Measurement } from './Measurement';
import { useMeasuringObservable } from './useMeasuringObservable';

export const useMeasuringObserver = <T extends Element, U extends Element>(observe: RefObject<T>, measure?: RefObject<U>): Measurement => 
    useObservable(useMeasuringObservable(observe, measure)) ?? { width: 0, height: 0 };
