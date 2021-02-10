export type MouseEvent = {
    readonly type: 'mousedown' | 'mouseenter' | 'mouseleave' | 'mousemove' | 'mouseup';
    readonly event: globalThis.MouseEvent;
};
