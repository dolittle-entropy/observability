import { useEffect } from 'react';
import { bisectCenter } from 'd3';
import { combineLatest } from 'rxjs';
import { DoubleSide, Font, Mesh, MeshBasicMaterial, Scene, ShapeGeometry, Vector3 } from 'three';

import { useRegion } from '@dolittle/observability.components/Region';
import { useSelectedMetrics } from '@dolittle/observability.components/Selection';

import { useAxes } from 'visualization/Graphical/Axes';
import { useFont } from 'visualization/Graphical/Fonts';
import { useColors } from 'visualization/Colors';

import { CurrentValueProps } from './CurrentValue.props';

const TEXT_Z_POSITION = 50;

type Text = {
    readonly text: Mesh;
    readonly size: Vector3;
    readonly setText: (value: string) => void;
    readonly dispose: () => void;
}

const createText = (figure: Scene, color: string, font: Font, fontSize: number): Text => {
    const geometry = new ShapeGeometry([]);
    const material = new MeshBasicMaterial({ color: color, side: DoubleSide });
    const text = new Mesh(geometry, material);
    text.position.setZ(TEXT_Z_POSITION);

    const size = new Vector3(0, 0, 0);
    figure.add(text);

    let previousValue = '';

    const setText = (value: string) => {
        if (value === previousValue) return;
        previousValue = value;

        const geometry = new ShapeGeometry(font.generateShapes(value, fontSize));
        geometry.computeBoundingBox();
        geometry.boundingBox.getSize(size);
        text.geometry.dispose();
        text.geometry = geometry;
    };

    const dispose = () => {
        figure.remove(text);
        material.dispose();
        geometry.dispose();
    };

    return { text, size, setText, dispose };
};

export const CurrentValue = (props: CurrentValueProps): JSX.Element => {
    const font = useFont(props.font);
    const { sequence } = useColors();
    const { figure, x, y, width, height } = useAxes();

    const region = useRegion();
    const data = useSelectedMetrics();

    useEffect(() => {
        if (!font || !sequence || !figure || width < 1 || height < 1 || !region || !data) return;

        const fontSize = props.fontSize ?? 20;
        const spacing = props.spacing ?? fontSize*0.2;

        const texts: Text[] = [];

        const subscription = combineLatest([region.selection.hover ,data]).subscribe(([{ isHovering, time }, { series }]) => {
            if (series.length < 1) {
                for (const removedText of texts.splice(0)) {
                    removedText.dispose();
                }
            } else {
                let totalTextHeight = 0;
                for (let n = 0; n < series.length; n++) {
                    if (texts.length <= n) {
                        texts.push(createText(figure, sequence(n), font, fontSize));
                    }

                    const values = series[n].values, times = series[n].times;
                    const index = isHovering ? bisectCenter(times, time.valueOf()) : values.length-1;
                    const value = values[index];
                    const formatted = typeof props.format === 'function' ? props.format(value) : value.toFixed(2);

                    const text = texts[n];
                    text.setText(formatted);
                    text.text.position.setX(width/2 - text.size.x/2 + x);
                    totalTextHeight += text.size.y + spacing;
                }
                totalTextHeight -= spacing;

                const lineHeight = totalTextHeight / series.length;

                for (let n = 0; n < series.length; n++) {
                    const text = texts[n];
                    text.text.position.setY(height/2 + totalTextHeight/2 - (lineHeight+spacing)*n - lineHeight/2 + y);
                }

                for (const removedText of texts.splice(series.length)) {
                    removedText.dispose();
                }
            }
        });

        return () => {
            subscription.unsubscribe();
            for (const text of texts) {
                text.dispose();
            }
        };
    }, [ sequence, figure, x, y, width, height, region, data, props.format ]);

    return null;
}