import { type JSX } from 'react';

import { useMousePos } from './Hooks.ts';

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
    offsetX = 0,
    offsetY = 0
}: MousePosTooltipProps) {

    const mousePos = useMousePos();


    return (mousePos.moved ? <div
        style={{
            position: "absolute",

            top: (mousePos.y + offsetY) + "px",
            left: (mousePos.x + offsetX) + "px",
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


    </div> : null);

    //return mousePos.moved ?
    //    <div
    //        className={className}
    //        style={{
    //                position: "absolute",
    //                top: (mousePos.y + offsetY) + "px",
    //                left: (mousePos.x + offsetX) + "px"
    //            }}
    //    >
    //        {content}
    //    </div>
    //    : null
}