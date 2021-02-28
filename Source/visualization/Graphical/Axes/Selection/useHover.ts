import { useEffect, useRef } from 'react';
import { scaleUtc, Selection } from 'd3';
import moment from 'moment';
import { merge } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

import { useRegion } from '@dolittle/observability.components/Region';

import { useAxes, useAxesMouseEvents } from 'visualization/Graphical/Axes';
import { Mesh, MeshBasicMaterial, PlaneGeometry } from 'three';

type Line = Mesh<PlaneGeometry, MeshBasicMaterial>;

export const useHover = (): void => {
    const { figure, x, y, width, height } = useAxes();
    const region = useRegion();
    const events = useAxesMouseEvents();

    const hoverLine = useRef<Line>();

    useEffect(() => {
        const material = new MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.5 });
        const geometry = new PlaneGeometry(2, height);
        const line = new Mesh(geometry, material);

        line.position.y = y+height/2;
        line.position.z = 100;
        line.visible = false;
        
        figure.add(line);
        hoverLine.current = line;

        return () => {
            hoverLine.current = null;
            figure.remove(line);
            material.dispose();
            geometry.dispose();
        };
    }, [figure, y, height])

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
    
                    return region.selection.hover.pipe(
                        map(({isHovering, time}) => ({ visible: isHovering, x: xaxis(time)}))
                    );
                }),
                tap(({ visible, x }) => {
                    if (!hoverLine.current) return;
                    hoverLine.current.visible = visible;
                    hoverLine.current.position.x = x;
                }),
            ),
        ).subscribe();

        return () => subscription.unsubscribe();
    }, [region, events, x, width]);
};
