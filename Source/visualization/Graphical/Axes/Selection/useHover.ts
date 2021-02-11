import { useEffect, useRef } from 'react';
import { scaleUtc, Selection } from 'd3';
import moment from 'moment';
import { merge } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

import { useRegion } from '@dolittle/observability.components/Region';

import { useAxes, useAxesMouseEvents } from 'visualization/Graphical/Axes';

type Line = Selection<SVGLineElement, unknown, null, undefined>;

type SetHoverLine = (line: Line) => void;

export const useHover = (): SetHoverLine => {
    const { figure, x, y, width, height } = useAxes();
    const region = useRegion();
    const events = useAxesMouseEvents();

    const hoverLine = useRef<Line>();

    useEffect(() => {
        if (!figure || !region || !events) return;

        const subscription = merge(
            region.domain.absolute.pipe(
                switchMap((domain) => {
                    const xaxis = scaleUtc().domain(domain).range([x, x+width]);
                    
                    return events.pipe(
                        map(({type, x}) => ({ hovering: type !== 'mouseleave', time: xaxis.invert(x) })),
                    );
                }),
                tap(({ hovering, time }) => {
                    region.selection.setHover(hovering, moment(time))
                }),
            ),
            region.domain.absolute.pipe(
                switchMap((domain) => {
                    const xaxis = scaleUtc().domain(domain).range([x, x+width]);
    
                    return  region.selection.hover.pipe(
                        map(({isHovering, time}) => ({ stroke: isHovering ? '#000000' : 'none', x: xaxis(time)}))
                    );
                }),
                tap(({ stroke, x }) => {
                    if (!hoverLine.current) return;
                    hoverLine.current
                        .attr('x1', x)
                        .attr('y1', y)
                        .attr('x2', x)
                        .attr('y2', y+height)
                        .attr('stroke', stroke);
                }),
            ),
        ).subscribe();

        return () => subscription.unsubscribe();
    }, [figure, region, events, x, y, width, height]);

    return (line) => hoverLine.current = line;
};
