import { useEffect, useRef } from 'react';
import { combineLatest, EMPTY, from, timer } from 'rxjs';
import { curveCatmullRom, extent, line as d3line, scaleLinear, scaleUtc, Selection } from 'd3';

import { useRegion } from '@dolittle/observability.components/Region';
import { SelectedMetrics, useSelectedMetrics } from '@dolittle/observability.components/Selection';
import { useRandomID } from '@dolittle/observability.components/Utilities/Identity';

import { useColors } from 'visualization/Colors';
import { useAxes } from 'visualization/Graphical/Axes';
import { useHover, useSelected } from 'visualization/Graphical/Axes/Selection';

import { PlotProps } from './Plot.props';
import { concatMap, map, sample, scan } from 'rxjs/operators';
import { AbsoluteDomain } from 'visualization/../data/Types/Domain';

export const Plot = (props: PlotProps): JSX.Element => {
    const { sequence } = useColors();
    const { figure, x, y, width, height } = useAxes();

    const region = useRegion();
    const data = useSelectedMetrics();

    const setHoverLine = useHover();
    const setSelectedBox = useSelected();

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

        const selected = figure.append('rect')
            .attr('fill', '#00000')
        setSelectedBox(selected);

        return () => {
            plot.current = null;
            setHoverLine(null);
            setSelectedBox(null);
            path.remove();
            hover.remove();
            selected.remove();
        };
    }, [figure]);

    const ID = useRandomID();
    useEffect(() => {
        if (!figure || width < 1 || height < 1) return;

        const clipPath = figure.append('clipPath')
            .attr('id', `plot-clip-${ID}`);
        clipPath.append('rect')
            .attr('x', x)
            .attr('y', y)
            .attr('width', width)
            .attr('height', height);

        return () => clipPath.remove();
    }, [figure, x, y, width, height]);

    useEffect(() => {
        if (!sequence || !figure || width < 1 || height < 1 || !region || !data) return;

        const subscription = combineLatest([region.domain.absolute, data]).pipe(
            map(([domain, data]) => [domain, domain, data] as [AbsoluteDomain,AbsoluteDomain,SelectedMetrics]),
            scan(([,currentDomain,], [,nextDomain,data]) => [currentDomain,nextDomain,data] as [AbsoluteDomain,AbsoluteDomain,SelectedMetrics]),
            concatMap(([currentDomain, domain, { series }]) => {
                if (!plot.current) return EMPTY;

                return from((async () => {
                    const range = props.range === 'dynamic' ? extent(series.flatMap(_ => _.range)) : props.range;
                    
                    const xaxis = scaleUtc().domain(domain).range([x, x+width]);
                    const yaxis = scaleLinear().domain(range).range([y+height, y]);

                    const line = d3line().x(d => xaxis(d[0])).y(d => yaxis(d[1])).curve(curveCatmullRom);

                    const shouldAnimate = currentDomain !== domain && Math.max(...series.map(_ => _.times.length)) < 400;

                    await plot.current.selectAll('path')
                        .data(series)
                        .join('path')
                        .attr('clip-path', `url(#plot-clip-${ID})`)
                        .transition().duration(shouldAnimate ? 1000 : 0)
                        .attr('stroke', (_, n) => sequence(n))
                        .attr('d', d => line(d.times.map((_,n) => [d.times[n], d.values[n]])))
                        .end();
                })())
            })
        ).subscribe();

        return () => subscription.unsubscribe();
    }, [ sequence, figure, x, y, width, height, region, data, props.range ]);

    return null;
};
