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
import { BufferGeometry, Color, InstancedInterleavedBuffer, InterleavedBufferAttribute, Scene, } from 'three';
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial';
import { Line2 } from 'three/examples/jsm/lines/Line2';
import { useConst } from '@fluentui/react-hooks';
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

const getPairOffsetAndCountInDomain = (domain: AbsoluteDomain, times: readonly number[]): [number, number] => {
    const startValue = domain[0].valueOf(), endValue = domain[1].valueOf();

    let startIndex = 0;
    while (startIndex < times.length && times[startIndex] < startValue) startIndex++;
    if (startIndex == times.length) return [0, 0];

    let endIndex = startIndex;
    while (endIndex < times.length && times[endIndex] <= endValue) endIndex++;
    if (endIndex == times.length) endIndex--;

    return [startIndex, endIndex-startIndex];
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

                const [offset, pairs] = getPairOffsetAndCountInDomain(domain, data.times);
                for (let m = offset; m < pairs; m++) {
                    line.points[6*m] = (data.times[m] - xOffset) * xScale + x;
                    line.points[6*m+1] = (data.values[m] - yOffset) * yScale + y;
                    line.points[6*m+3] = (data.times[m+1] - xOffset) * xScale + x;
                    line.points[6*m+4] = (data.values[m+1] - yOffset) * yScale + y;
                }

                line.needsUpdate(pairs);
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
