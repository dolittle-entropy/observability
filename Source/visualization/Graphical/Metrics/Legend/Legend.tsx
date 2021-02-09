import { useEffect } from 'react';

import { useSelectedMetrics } from '@dolittle/observability.components/Selection';
import { LabelName } from '@dolittle/observability.data/Types/Labels';
import { MetricSeries } from '@dolittle/observability.data/Types/MetricSeries';

import { useAxes } from 'visualization/Graphical/Axes';
import { useColors } from 'visualization/Colors';

import { LegendProps } from './Legend.props';

const legendText = (series: MetricSeries, labelSelector?: LabelName[] | ((name: LabelName) => boolean)): string => {
    const name = series.name ?? '';
    const labels = [...series.labels.entries()]
        .filter(([name]) => {
            if (name.startsWith('__')) return false;
            if (labelSelector === undefined) return true;
            if (Array.isArray(labelSelector)) return labelSelector.includes(name);
            return labelSelector(name);
        })
        .map(([name, value]) => `${name}="${value}"`);
    
    return name + (labels.length > 0 ? '{'+labels.join(',')+'}' : '');
}

export const Legend = (props: LegendProps): JSX.Element => {
    const { sequence } = useColors();
    const { figure, x, y } = useAxes();

    const data = useSelectedMetrics();

    useEffect(() => {
        if (!sequence || !figure || !data) return;

        const path = figure.append('g')
            .attr('fill', 'none')
            .attr('stroke-width', 1.5)
            .attr('stroke-linecap', 'round')
            .attr('stroke-linejoin', 'round');

        const text = figure.append('g')
            .attr('font-size', 10)
            .attr('fill', '#000')
            .attr('stroke-linecap', 'round')
            .attr('stroke-linejoin', 'round')
            .attr('dominant-baseline', 'hanging')
            .attr('text-anchor', 'left');

        const subscription = data.subscribe(({ series }) => {

            path.selectAll('line')
                .data(series)
                .join('line')
                    .attr('x1', x)
                    .attr('y1', (_, n) => y+6+10*n)
                    .attr('x2', x+10)
                    .attr('y2', (_, n) => y+6+10*n)
                    .attr('stroke', (_, n) => sequence(n));
    
            text.selectAll('text')
                .data(series)
                .join('text')
                    .attr('x', x+12)
                    .attr('y', (_, n) => y+10*n)
                    .text(d => legendText(d, props.labels));
        });

        return () => {
            subscription.unsubscribe();
            path.remove();
            text.remove();
        };
    }, [ sequence, figure, x, y, data, props.labels ]);

    return null;
};
