import { useEffect, useRef } from 'react';

import { useRegion } from '@dolittle/observability.components/Region';

import { useAxes, useAxesMouseEvents } from 'visualization/Graphical/Axes';
import { exhaustMap, map, switchMap, takeWhile, tap } from 'rxjs/operators';
import { scaleUtc, Selection } from 'd3';
import { combineLatest, EMPTY, merge, of } from 'rxjs';
import moment from 'moment';

type Box = Selection<SVGRectElement, unknown, null, undefined>;

type SetSelectedBox = (box: Box) => void;

export const useSelected = (): SetSelectedBox => {
    const { figure, x, y, width, height } = useAxes();
    const region = useRegion();
    const events = useAxesMouseEvents();

    const selectedBox = useRef<Box>();

    useEffect(() => {
        if (!figure || !region || !events) return;

        const timedEvents = region.domain.absolute.pipe(
            switchMap((domain) => {
                const xaxis = scaleUtc().domain(domain).range([x, x+width]);

                return events.pipe(
                    map(({type, x}) => ({ type, time: xaxis.invert(x)})),
                );
            }),
        );

        const subscription = merge(
            combineLatest([region.selection.selected, timedEvents]).pipe(
                exhaustMap(([{hasSelected, from, to}, {type, time}]) => {
                    if (hasSelected) {
                        if (type === 'mousedown') {
                            const clickedTime = moment(time);
                            if (clickedTime.isAfter(from) && clickedTime.isBefore(to)) {
                                region.domain.setAbsolute(from, to);
                                return of({ selected: false, firstTime: from, secondTime: to });
                            }
                            region.selection.setSelected(false);
                        }
                        return EMPTY;
                    } else {
                        if (type !== 'mousedown') return EMPTY;
        
                        const firstTime = moment(time);
                        return timedEvents.pipe(
                            takeWhile(({type}) => type !== 'mouseup' && type !== 'mouseleave', true),
                            map(({type, time}) => ({ selected: type !== 'mouseleave', firstTime, secondTime: moment(time) })),
                        );
                    }
                }),
                tap(({selected, firstTime, secondTime}) => {
                    if (!selected) {
                        region.selection.setSelected(false);
                    } else if (firstTime.isBefore(secondTime)) {
                        region.selection.setSelected(true, firstTime, secondTime);
                    } else {
                        region.selection.setSelected(true, secondTime, firstTime);
                    }
                })
            ),
            region.domain.absolute.pipe(
                switchMap((domain) => {
                    const xaxis = scaleUtc().domain(domain).range([x, x+width]);
    
                    return region.selection.selected.pipe(
                        tap(({hasSelected, from, to}) => {
                            if (hasSelected) {
                                const isBefore = from.isBefore(domain[0]);
                                const isAfter = to.isAfter(domain[1]);
                                if (isBefore && isAfter) {
                                    region.selection.setSelected(true, domain[0], domain[1]);
                                } else if (isBefore) {
                                    region.selection.setSelected(true, domain[0], to);
                                } else if (isAfter) {
                                    region.selection.setSelected(true, from, domain[1]);
                                }
                            }
                        }),
                        map(({hasSelected, from, to}) => {
                            const x = xaxis(from);
                            const width = xaxis(to) - x;
                            return { opacity: hasSelected ? 0.5 : 0, cursor: hasSelected ? 'pointer' : 'auto', x, width };
                        }),
                        tap(({opacity, cursor, x, width}) => {
                            if (!selectedBox.current) return;
                            selectedBox.current
                                .attr('x', x)
                                .attr('y', y)
                                .attr('width', width)
                                .attr('height', height)
                                .attr('fill-opacity', opacity)
                                .attr('cursor', cursor);
                        }),
                    );
                }),
            ),
        ).subscribe();

        return () => subscription.unsubscribe();
    }, [figure, region, events, x, y, width, height]);

    return (box) => selectedBox.current = box;
};
