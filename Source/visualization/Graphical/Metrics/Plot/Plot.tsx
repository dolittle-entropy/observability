import { useEffect } from 'react';
import { combineLatest } from 'rxjs';
import { extent, line as d3line, scaleLinear, scaleUtc, curveCatmullRom, pointer } from 'd3';
import moment from 'moment';

import { useRegion } from '@dolittle/observability.components/Region';
import { useSelectedMetrics } from '@dolittle/observability.components/Selection';

import { useAxes } from 'visualization/Graphical/Axes';
import { useColors } from 'visualization/Colors';

import { PlotProps } from './Plot.props';

export const Plot = (props: PlotProps): JSX.Element => {
    const { sequence } = useColors();
    const { figure, x, y, width, height } = useAxes();

    const region = useRegion();
    const data = useSelectedMetrics();

    useEffect(() => {
        if (!sequence || !figure || width < 1 || height < 1 || !region || !data) return;

        const path = figure.append('g')
            .attr('fill', 'none')
            .attr('stroke-width', 1.5)
            .attr('stroke-linecap', 'round')
            .attr('stroke-linejoin', 'round');

        let xaxis = scaleUtc();

        const subscription = combineLatest([region.domain.absolute, data]).subscribe(([domain, { series }]) => {

            const range = props.range === 'dynamic' ? extent(series.flatMap(_ => _.range)) : props.range;
            
            xaxis = scaleUtc().domain(domain).range([x, x+width]);
            const yaxis = scaleLinear().domain(range).range([y+height, y]);

            const line = d3line().x(d => xaxis(d[0])).y(d => yaxis(d[1])).curve(curveCatmullRom);
            path.selectAll('path')
                .data(series)
                .join('path')
                .attr('stroke', (_, n) => sequence(n))
                .attr('d', d => line(d.times.map((_,n) => [d.times[n], d.values[n]])));
        });


        let isMovingInside = false;
        const move = (event: MouseEvent) => {
            const [mouseX, mouseY] = pointer(event, svg);
            if (mouseX < x || mouseX > x+width || mouseY < y || mouseY > y+height) {
                if (isMovingInside) {
                    region.selection.setHover(false);
                    isMovingInside = false;
                }
                return;
            }

            isMovingInside = true;
            const time = xaxis.invert(mouseX);
            region.selection.setHover(true, moment(time));
        };
        const leave = () => {
            if (isMovingInside) {
                region.selection.setHover(false);
                isMovingInside = false;
            }
        };

        const svg = figure.node();
        svg.addEventListener('mousemove', move);
        svg.addEventListener('mouseleave', leave);

        const hoverline = figure.append('line')
            .attr('fill', 'none')
            .attr('stroke', '#000')
            .attr('stroke-width', 1.5)
            .attr('stroke-linecap', 'round')
            .attr('stroke-linejoin', 'round')
            .attr('y1', y)
            .attr('y2', y+height)
            .attr('x1', x)
            .attr('x2', x)
            .style('opacity', 0);

        const hsub = region.selection.hover.subscribe(({isHovering, time}) => {
            if (isHovering) {
                const x = xaxis(time);
                hoverline.attr('x1', x).attr('x2', x).style('opacity', 1);
            } else {
                hoverline.style('opacity', 0);
            }
        })

        return () => {
            subscription.unsubscribe();
            hsub.unsubscribe();
            path.remove();
            hoverline.remove();
            svg.removeEventListener('mousemove', move);
            svg.removeEventListener('mouseleave', leave);
        };
    }, [ sequence, figure, x, y, width, height, region, data, props.range ]);

    return null;
}