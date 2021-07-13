import { useEffect } from 'react';
import { combineLatest } from 'rxjs';
import { extent } from 'd3';

import { useRegion } from '@dolittle/observability.components/Region';
import { useSelectedMetrics } from '@dolittle/observability.components/Selection';

import { useColors } from 'visualization/Colors';
import { useAxes } from 'visualization/Graphical/Axes';
import { useHover, useSelected } from 'visualization/Graphical/Axes/Selection';

import { PlotProps } from './Plot.props';
import { AbsoluteDomain } from 'visualization/../data/Types/Domain';
import { Color, InstancedInterleavedBuffer, InterleavedBufferAttribute, Scene, } from 'three';
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial';
import { Line2 } from 'three/examples/jsm/lines/Line2';
import { MetricSeries } from 'visualization/../data/Types/MetricSeries';

const MAX_POINTS = 4000;

type Line = {
    readonly points: Float32Array;
    readonly geometry: LineGeometry;
    readonly needsUpdate: (pairs: number) => void;
    readonly dispose: () => void;
};

const createLine = (figure: Scene, color: string, width: number, opacity: number): Line => {
    const geometry = new LineGeometry();
    const points = new Float32Array(6 * (MAX_POINTS-1));
    const buffer = new InstancedInterleavedBuffer(points, 6, 1);
    geometry.setAttribute('instanceStart', new InterleavedBufferAttribute(buffer, 3, 0));
    geometry.setAttribute('instanceEnd', new InterleavedBufferAttribute(buffer, 3, 3));

    const material = new LineMaterial({ color: new Color(color).getHex(), linewidth: width, opacity });
    const line = new Line2(geometry, material);
    figure.add(line);

    let lastNumberOfPairs = 0;
    const needsUpdate = (pairs: number) => {
        if (pairs < lastNumberOfPairs) points.fill(0, 6*(pairs+1));
        lastNumberOfPairs = pairs;

        geometry.attributes.instanceStart.needsUpdate = true;
        geometry.computeBoundingBox();
        geometry.computeBoundingSphere();
    };

    const dispose = () => {
        figure.remove(line);
        material.dispose();
        geometry.dispose();
    };

    return { points, geometry, needsUpdate, dispose };
};

const getXOffsetScale = (domain: AbsoluteDomain, width: number): [number, number] => {
    const offset = domain[0].valueOf();
    const scale = width / (domain[1].valueOf() - offset);
    return [offset, scale];
};

const getYOffsetScale = (range: [number, number] | 'dynamic', height: number, series: readonly MetricSeries[]): [number, number] => {
    if (range === 'dynamic') {
        const extents = series.flatMap(({values}) => extent(values)).filter(_ => _ !== undefined);
        range = extents.length > 0 ? [Math.min(...extents), Math.max(...extents)] : [0, 1];
    }

    const offset = range[0];
    const scale = height / (range[1] - offset);
    return [offset, scale];
};

const shouldDrawPoint = (startTime: number, endTime: number, time: number, value: number): boolean => {
    if (startTime > time || time > endTime) return false;
    if (!Number.isFinite(value)) return false;
    return true;
}

const getIndexBlocksToDraw = (domain: AbsoluteDomain, times: readonly number[], values: readonly number[]): [number, number][] => {
    const startTime = domain[0].valueOf(), endTime = domain[1].valueOf();

    const blocks: [number, number][] = [];
    let index = 0;
    while (index < times.length && times[index] <= endTime) {
        while (index < times.length && !shouldDrawPoint(startTime, endTime, times[index], values[index])) index++;
        if (index == times.length) break;
        const blockStartIndex = index;

        while (index < times.length && shouldDrawPoint(startTime, endTime, times[index], values[index])) index++;
        let blockEndIndex = index-1;
        if (!shouldDrawPoint(startTime, endTime, times[blockEndIndex], values[blockEndIndex])) blockEndIndex = blockStartIndex;

        blocks.push([blockStartIndex, blockEndIndex]);
    }

    return blocks;
}

export const Plot = (props: PlotProps): JSX.Element => {
    const { sequence } = useColors();
    const { figure, x, y, width, height, figureWidth } = useAxes();

    const region = useRegion();
    const data = useSelectedMetrics();

    useHover();
    useSelected();

    useEffect(() => {
        if (!figure || !region || !data) return;

        const lines: Line[] = [];

        const subscription = combineLatest([region.domain.absolute, data]).subscribe(([domain, { series }]) => {
            const [xOffset, xScale] = getXOffsetScale(domain, width);
            const [yOffset, yScale] = getYOffsetScale(props.range, height, series);

            for (let n = 0; n < series.length; n++) {
                if (lines.length <= n) {
                    lines.push(createLine(figure, sequence(n), 2/figureWidth, 1));
                }

                const line = lines[n];
                const data = series[n];

                const blocks = getIndexBlocksToDraw(domain, data.times, data.values);
                let m = 0;
                for (const [blockStart, blockEnd] of blocks) {
                    if (blockStart == blockEnd) {
                        line.points[6*m] = (data.times[blockStart] - xOffset) * xScale + x;
                        line.points[6*m+1] = (data.values[blockStart] - yOffset) * yScale + y;
                        line.points[6*m+3] = (data.times[blockStart] - xOffset) * xScale + x;
                        line.points[6*m+4] = (data.values[blockStart] - yOffset) * yScale + y;
                        m++;
                    } else {
                        for (let n = blockStart; n < blockEnd; n++) {
                            line.points[6*m] = (data.times[n] - xOffset) * xScale + x;
                            line.points[6*m+1] = (data.values[n] - yOffset) * yScale + y;
                            line.points[6*m+3] = (data.times[n+1] - xOffset) * xScale + x;
                            line.points[6*m+4] = (data.values[n+1] - yOffset) * yScale + y;
                            m++;
                        }
                    }
                }

                line.needsUpdate(m);
            }

            for (const removedLine of lines.splice(series.length)) {
                removedLine.dispose();
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [figure, region, data, x, y, width, height, figureWidth, props.range]);

    return null;
};
