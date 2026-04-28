import { type JSX } from 'react';

export interface PositionTooltipProps {
    className: string,
    content: JSX.Element,
    positionX: number,
    positionY: number,
    arrowSize?: number
    offsetX?: number,
    offsetY?: number
}

export default function PositionTooltip({
    className,
    content,
    positionX,
    positionY,
    arrowSize=10,
    offsetX=arrowSize,
    offsetY=-arrowSize
}: PositionTooltipProps) {
    return <div
        style={{
            position: "absolute",

            top: (positionY + offsetY) + "px",
            left: (positionX + offsetX) + "px",
            pointerEvents: "none"
        }}>
        <div
            className={className}
            style={{
                position: "absolute",
                right: "100%",
                backgroundColor: "transparent",
                borderBottomColor: "transparent",
                borderLeftColor: "transparent",
                borderTopColor: "transparent",
                borderWidth: arrowSize + "px",
                borderRadius: "0px",
                pointerEvents: "none",
                padding: "0",
            }}
        >{" "}</div>
        <div className={className}>{content}</div>
    </div>;
}