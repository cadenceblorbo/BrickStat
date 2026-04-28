import { type JSX } from 'react';

import { useElemPos } from './Hooks.ts';
import PositionTooltip from './PositionTooltip.tsx';

export interface ElemPosTooltipProps {
    toTrack: HTMLElement,
    className: string,
    content: JSX.Element,
    arrowSize?: number
    offsetX?: number,
    offsetY?: number
}

export default function ElemPosTooltip({
    toTrack,
    className,
    content,
    arrowSize = 10,
    offsetX = arrowSize,
    offsetY = -arrowSize
}: ElemPosTooltipProps) {

    const elemPos = useElemPos(toTrack);

    const result = <PositionTooltip
        className={className}
        content={content}
        positionX={elemPos.x}
        positionY={elemPos.y}
        arrowSize={arrowSize}
        offsetX={offsetX}
        offsetY={offsetY}
    />;

    return result;
}