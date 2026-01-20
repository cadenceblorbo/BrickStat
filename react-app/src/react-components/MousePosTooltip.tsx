

import { useMousePos } from './Hooks.ts'

export interface MousePosTooltipProps {
    className: string,
    content: string
}

export default function MousePosTooltip({
    className,
    content
}: MousePosTooltipProps) {

    const mousePos = useMousePos();



    return mousePos.moved ?
        <div
            className={className}
            style={{ position: "absolute", top: mousePos.y + "px", left: mousePos.x + "px" }}
        >
            {content}
        </div>
        : null
}