import { type JSX } from 'react';

import { useMousePos } from './Hooks.ts';
import PositionTooltip from './PositionTooltip.tsx';

export interface MousePosTooltipProps {
    className: string,
    content: JSX.Element,
    arrowSize?: number
    offsetX?: number,
    offsetY?: number
}

export default function MousePosTooltip({
    className,
    content,
    arrowSize = 10,
    offsetX = arrowSize,
    offsetY = -arrowSize
}: MousePosTooltipProps) {

    const mousePos = useMousePos();

    const result = (mousePos.moved ?
        <PositionTooltip className={className} content={content} positionX={mousePos.x} positionY={mousePos.y} arrowSize={arrowSize} offsetX={offsetX} offsetY={offsetY}></PositionTooltip>
        : null);


    return result;
}