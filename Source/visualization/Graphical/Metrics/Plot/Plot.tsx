import { useEffect, useRef } from 'react';
import { combineLatest } from 'rxjs';
import { curveCatmullRom, extent, line as d3line, scaleLinear, scaleUtc, Selection } from 'd3';

import { useRegion } from '@dolittle/observability.components/Region';
import { useSelectedMetrics } from '@dolittle/observability.components/Selection';

import { useColors } from 'visualization/Colors';
import { useAxes } from 'visualization/Graphical/Axes';
import { useHover } from 'visualization/Graphical/Axes/Selection';

import { PlotProps } from './Plot.props';

export const Plot = (props: PlotProps): JSX.Element => {
    const { sequence } = useColors();
    const { figure, x, y, width, height } = useAxes();

    const region = useRegion();
    const data = useSelectedMetrics();

    const setHoverLine = useHover();

    const plot = useRef<Selection<SVGGElement,unknown,null,undefined>>();

    useEffect(() => {
        if (!figure) return;

        const path = plot.current = figure.append('g')
            .attr('fill', 'none')
            .attr('stroke-width', 1.5)
            .attr('stroke-linecap', 'round')
            .attr('stroke-linejoin', 'round');

        const hover = figure.append('line')
            .attr('stroke-width', 1.5)
            .attr('stroke-linecap', 'round')
            .attr('stroke-linejoin', 'round')
        setHoverLine(hover);

        return () => {
            plot.current = null;
            setHoverLine(null);
            path.remove();
            hover.remove();
        };
    }, [figure]);

    useEffect(() => {
        if (!sequence || !figure || width < 1 || height < 1 || !region || !data) return;

        const subscription = combineLatest([region.domain.absolute, data]).subscribe(([domain, { series }]) => {
            if (!plot.current) return;

            const range = props.range === 'dynamic' ? extent(series.flatMap(_ => _.range)) : props.range;
            
            const xaxis = scaleUtc().domain(domain).range([x, x+width]);
            const yaxis = scaleLinear().domain(range).range([y+height, y]);

            const line = d3line().x(d => xaxis(d[0])).y(d => yaxis(d[1])).curve(curveCatmullRom);
            plot.current.selectAll('path')
                .data(series)
                .join('path')
                .attr('stroke', (_, n) => sequence(n))
                .attr('d', d => line(d.times.map((_,n) => [d.times[n], d.values[n]])));
        });
        return () => subscription.unsubscribe();
    }, [ sequence, figure, x, y, width, height, region, data, props.range ]);

    return null;
};
