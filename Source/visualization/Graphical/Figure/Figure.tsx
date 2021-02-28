import React, { createRef } from 'react';
import { useConst, useRefEffect } from '@fluentui/react-hooks';
import { BufferGeometry, Line, LineBasicMaterial, OrthographicCamera, Scene, Vector2, WebGLRenderer } from 'three';

import { useObservable } from '@dolittle/observability.components/Utilities/Reactive';

import { Axes } from 'visualization/Graphical/Axes';
import { useMeasuringObservable } from 'visualization/Utilities/Measuring';

import { FigureProps } from './Figure.props';
import { FigureContext } from './Figure.context';

const dimensionToStyle = (dimension?: number | string): string => {
    switch (typeof dimension) {
        case 'number':
            return `${dimension}px`;
        case 'string':
            return dimension;
        default:
            return '100%';
    }
}

export const Figure = (props: FigureProps): JSX.Element => {
    const scene = useConst(() => {
        const scene = new Scene();
        return scene;
    });
    const camera = useConst(() => {
        const camera = new OrthographicCamera(0, 1, 1, 0, 1, 1000);
        camera.position.z = 500;
        camera.updateProjectionMatrix();
        return camera;
    });

    const container = createRef<HTMLDivElement>();
    const size = useMeasuringObservable(container);

    const canvas = useRefEffect<HTMLCanvasElement>((canvas) => {
        const renderer = new WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
        renderer.setPixelRatio(window.devicePixelRatio);

        const subscription = size.subscribe(({width, height}) => {
            camera.right = width;
            camera.top = height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
        });

        let stop = false;
        const render = () => {
            if (stop) return;
            requestAnimationFrame(render);
            renderer.render(scene, camera);
        }
        render();

        return () => {
            stop = true;
            subscription.unsubscribe();
            renderer.dispose();
        };
    });

    const {width, height} = useObservable(size) ?? { width: 0, height: 0 };

    return (
        <div ref={container} style={{ width: dimensionToStyle(props.width), height: dimensionToStyle(props.height) }}>
            <canvas ref={canvas}>
                <FigureContext.Provider value={{ figure: scene, canvas: canvas.current, width, height }}>
                {
                    width && height &&
                        <Axes position={[0, 0, width, height]}>
                            { props.children }
                        </Axes>
                }
                </FigureContext.Provider>
            </canvas>
        </div>
    );
}