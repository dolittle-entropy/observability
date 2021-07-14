import { useEffect } from 'react';
import { DoubleSide, Mesh, MeshBasicMaterial, PlaneGeometry, Scene, ShapeGeometry, Vector3 } from 'three';

import { useSelectedMetrics } from '@dolittle/observability.components/Selection';
import { LabelName } from '@dolittle/observability.data/Types/Labels';
import { MetricSeries } from '@dolittle/observability.data/Types/MetricSeries';

import { useAxes } from 'visualization/Graphical/Axes';
import { useFont } from 'visualization/Graphical/Fonts';
import { useColors } from 'visualization/Colors';

import { LegendPosition, LegendProps } from './Legend.props';

const LINE_WIDTH = 2;
const LINE_LENGTH = 10;
const LEGEND_Z_POSITION = 100;

enum VerticalPosition { Top, Middle, Bottom }
enum HorizontalPosition { Left, Center, Right }
type Position = { vertical: VerticalPosition, horizontal: HorizontalPosition }

const getPosition = (position?: LegendPosition): Position => {
    switch (position) {
        case 'topleft':
            return { vertical: VerticalPosition.Top, horizontal: HorizontalPosition.Left };
        case 'top':
        case 'topcenter':
            return { vertical: VerticalPosition.Top, horizontal: HorizontalPosition.Center };
        case 'topright':
        default:
            return { vertical: VerticalPosition.Top, horizontal: HorizontalPosition.Right };
        case 'left':
        case 'middleleft':
            return { vertical: VerticalPosition.Middle, horizontal: HorizontalPosition.Left };
        case 'center':
        case 'middlecenter':
            return { vertical: VerticalPosition.Middle, horizontal: HorizontalPosition.Center };
        case 'right':
        case 'middleright':
            return { vertical: VerticalPosition.Middle, horizontal: HorizontalPosition.Right };
        case 'bottomleft':
            return { vertical: VerticalPosition.Bottom, horizontal: HorizontalPosition.Left };
        case 'bottom':
        case 'bottomcenter':
            return { vertical: VerticalPosition.Bottom, horizontal: HorizontalPosition.Center };
        case 'bottomright':
            return { vertical: VerticalPosition.Bottom, horizontal: HorizontalPosition.Right };
    }
}

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
    
    return name + (labels.length > 0 ? ' {'+labels.join(',')+'}' : '');
}

type Line = {
    readonly line: Mesh;
    readonly dispose: () => void;
}

const createLine = (figure: Scene, color: string): Line => {
    const geometry = new PlaneGeometry(LINE_LENGTH, LINE_WIDTH);
    const material = new MeshBasicMaterial({ color: color, side: DoubleSide });
    const line = new Mesh(geometry, material);
    line.position.setZ(LEGEND_Z_POSITION+1);

    figure.add(line);

    const dispose = () => {
        figure.remove(line);
        material.dispose();
        geometry.dispose();
    };

    return { line, dispose };
};

export const Legend = (props: LegendProps): JSX.Element => {
    const font = useFont(props.font);
    const { sequence } = useColors();
    const { figure, x, y, width, height } = useAxes();

    const data = useSelectedMetrics();

    useEffect(() => {
        if (!font || !sequence || !figure || !data) return;

        const fontSize = props.fontSize ?? 10;
        const padding = props.padding ?? 4;
        const emSize = new Vector3();
        const textSize = new Vector3();

        const position = getPosition(props.position);

        const emGeometry = new ShapeGeometry(font.generateShapes('M', fontSize));
        emGeometry.computeBoundingBox();
        emGeometry.boundingBox.getSize(emSize);

        const lineHeightGeometry = new ShapeGeometry(font.generateShapes('M\nM', fontSize));
        lineHeightGeometry.computeBoundingBox();
        lineHeightGeometry.boundingBox.getSize(textSize);
        const lineHeight = textSize.y - emSize.y;

        const backdropGeometry = new PlaneGeometry(1, 1);
        const backdropMaterial = new MeshBasicMaterial({ color: 0xFFFFFF, side: DoubleSide, transparent: true, opacity: 0.8 });
        
        const backdropObject = new Mesh(backdropGeometry, backdropMaterial);
        backdropObject.position.setZ(LEGEND_Z_POSITION);
        backdropObject.scale.set(0, 0, 1);
        figure.add(backdropObject);

        const textGeometry = new ShapeGeometry([]);
        const textMaterial = new MeshBasicMaterial({ color: 0x000000, side: DoubleSide });

        const textObject = new Mesh(textGeometry, textMaterial);
        textObject.position.setZ(LEGEND_Z_POSITION+1);
        figure.add(textObject);

        const lines: Line[] = [];

        const subscription = data.subscribe(({ series }) => {
            if (series.length < 1) {
                const textGeometry = new ShapeGeometry([]);
                textObject.geometry.dispose();
                textObject.geometry = textGeometry;

                backdropObject.scale.set(0, 0, 1);

                for (const removedLine of lines.splice(0)) {
                    removedLine.dispose();
                }
            } else {
                const text = series.map(d => legendText(d, props.labels)).join('\n');
    
                const textGeometry = new ShapeGeometry(font.generateShapes(text, fontSize));
                textGeometry.computeBoundingBox();
                textGeometry.boundingBox.getSize(textSize);
                textObject.geometry.dispose();
                textObject.geometry = textGeometry;
    
                const legendWidth = textSize.x + LINE_LENGTH + 3*padding, legendHeight = textSize.y + 2*padding;
    
                backdropObject.scale.set(legendWidth, legendHeight, 1);

                const legendTop =
                    position.vertical === VerticalPosition.Top ? height + y :
                    position.vertical === VerticalPosition.Bottom ? legendHeight + y :
                    height/2 + legendHeight/2 + y;

                const legendLeft =
                    position.horizontal === HorizontalPosition.Left ? x :
                    position.horizontal === HorizontalPosition.Right ? width - legendWidth + x :
                    width/2 - legendWidth/2 + x;

                backdropObject.position
                    .setY(legendTop - legendHeight/2)
                    .setX(legendLeft + legendWidth/2);
                textObject.position
                    .setY(legendTop - padding - emSize.y)
                    .setX(legendLeft + LINE_LENGTH + 2*padding);

                for (let n = 0; n < series.length; n++) {
                    if (lines.length <= n) {
                        lines.push(createLine(figure, sequence(n)));
                    }

                    const line = lines[n].line;
                    line.position
                        .setY(legendTop - padding - emSize.y/2 - n*lineHeight)
                        .setX(legendLeft + padding + LINE_LENGTH/2);
                }

                for (const removedLine of lines.splice(series.length)) {
                    removedLine.dispose();
                }
            }
        });

        return () => {
            subscription.unsubscribe();
            figure.remove(backdropObject, textObject);
            backdropGeometry.dispose();
            backdropMaterial.dispose();
            textGeometry.dispose();
            textMaterial.dispose();

            for (const line of lines) {
                line.dispose();
            }
        };
    }, [ font, sequence, figure, x, y, width, height, data, props.labels, props.font, props.fontSize ]);
    


    // useEffect(() => {
    //     if (!sequence || !figure || !data) return;

    //     const path = figure.append('g')
    //         .attr('fill', 'none')
    //         .attr('stroke-width', 1.5)
    //         .attr('stroke-linecap', 'round')
    //         .attr('stroke-linejoin', 'round');

    //     const text = figure.append('g')
    //         .attr('font-size', 10)
    //         .attr('fill', '#000')
    //         .attr('stroke-linecap', 'round')
    //         .attr('stroke-linejoin', 'round')
    //         .attr('dominant-baseline', 'hanging')
    //         .attr('text-anchor', 'left');

    //     const subscription = data.subscribe(({ series }) => {

    //         path.selectAll('line')
    //             .data(series)
    //             .join('line')
    //                 .attr('x1', x)
    //                 .attr('y1', (_, n) => y+6+10*n)
    //                 .attr('x2', x+10)
    //                 .attr('y2', (_, n) => y+6+10*n)
    //                 .attr('stroke', (_, n) => sequence(n));
    
    //         text.selectAll('text')
    //             .data(series)
    //             .join('text')
    //                 .attr('x', x+12)
    //                 .attr('y', (_, n) => y+10*n)
    //                 .text(d => legendText(d, props.labels));
    //     });

    //     return () => {
    //         subscription.unsubscribe();
    //         path.remove();
    //         text.remove();
    //     };
    // }, [ sequence, figure, x, y, data, props.labels ]);

    return null;
};
