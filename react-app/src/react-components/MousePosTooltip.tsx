import {JSX } from 'react'

import { useMousePos } from './Hooks.ts'

export interface MousePosTooltipProps {
    className: string,
    content: JSX.Element,
    offsetX?: number,
    offsetY?: number
}

export default function MousePosTooltip({
    className,
    content,
    offsetX = 0,
    offsetY = 0
}: MousePosTooltipProps) {

    const mousePos = useMousePos();


    return <div
        style={{
            position: "absolute",
            top: (mousePos.y + offsetY) + "px",
            left: (mousePos.x + offsetX) + "px",
            display: "flex"
        }}>
        <div className={"tooltipafter"}>{" "}</div>
        <div className={className}>{content}</div>


    </div>

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