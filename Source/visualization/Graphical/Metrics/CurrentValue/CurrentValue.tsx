import { useEffect } from 'react';
import { bisectCenter } from 'd3';
import { combineLatest } from 'rxjs';

import { useRegion } from '@dolittle/observability.components/Region';
import { useSelectedMetrics } from '@dolittle/observability.components/Selection';

import { useAxes } from 'visualization/Graphical/Axes';
import { useColors } from 'visualization/Colors';

import { CurrentValueProps } from './CurrentValue.props';

export const CurrentValue = (props: CurrentValueProps): JSX.Element => {
    const { sequence } = useColors();
    const { figure, x, y, width, height } = useAxes();

    const region = useRegion();
    const data = useSelectedMetrics();

    useEffect(() => {
        if (!sequence || !figure || width < 1 || height < 1 || !region || !data) return;

        const text = figure.append('g')
            .attr('font-size', 50)
            .attr('fill', '#000')
            .attr('stroke-linecap', 'round')
            .attr('stroke-linejoin', 'round')
            .attr('dominant-baseline', 'middle')
            .attr('text-anchor', 'middle');

        const subscription = combineLatest([region.selection.hover ,data]).subscribe(([{ isHovering, time }, { series }]) => {

            const values = series.map(_ => {
                const n = isHovering ? bisectCenter(_.times, time.valueOf()) : _.values.length-1;
                return _.values[n]
            });

            text.selectAll('text')
                .data(values)
                .join('text')
                    .attr('x', (_, n) => x+(1+2*n)*(width/(2*values.length)))
                    .attr('y', y+height/2)
                    .attr('fill', (_, n) => sequence(n))
                    .text(d => typeof props.format === 'function' ? props.format(d) : d.toFixed(2));
        });

        return () => {
            subscription.unsubscribe();
            text.remove();
        };
    }, [ sequence, figure, x, y, width, height, region, data, props.format ]);

    return null;
}