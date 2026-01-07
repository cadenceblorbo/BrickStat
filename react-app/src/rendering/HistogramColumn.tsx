import { useState, useRef, useEffect, useReducer } from 'react';
import { type ThreeElements, useFrame } from "@react-three/fiber";
import { Vector3 } from "three";

export interface HistogramColumnProps {
    meshProps: ThreeElements['mesh'];
    height?: number;
    xWidth?: number;
    yWidth?: number;
}

export function HistogramColumn({
    meshProps,
    height = 1,
    xWidth = 1,
    yWidth = 1,
}: HistogramColumnProps) {
    let usedPosition = meshProps?.position as Vector3 || new Vector3(0, 0, 0);
    usedPosition = new Vector3(usedPosition.x, usedPosition.y + height / 2, usedPosition.z);
    const newProps = { ...meshProps, position: usedPosition }
    return <mesh
        {...newProps}
    >
        <boxGeometry args={[xWidth, height, yWidth]} />
    </mesh>
}

export interface AnimatedColumnProps {
    meshProps: ThreeElements['mesh'];
    heightStart?: number;
    heightTarget?: number;
    handleHeightChange?: (h: number) => void;
    xWidth?: number;
    yWidth?: number;
    flag?: string;
}

//function reducer(state, action) {
//    switch
//}

export function AnimatedHistogramColumn({
    meshProps,
    heightStart = 1,
    heightTarget = 1,
    xWidth = 1,
    yWidth = 1,
    flag = "",
}: AnimatedColumnProps) {
    const [time, setTime] = useState(0)
    const [height, setHeight] = useState(heightStart)
    const [oldHeight, setOldHeight] = useState(heightStart)
    useEffect(() => {
        setOldHeight(height);
        setTime(0);
    }, [heightTarget])
    useFrame((state, delta) => {
        if (time < 1) {
            setHeight(height => height + Lerp(oldHeight, heightTarget, time + delta) - Lerp(oldHeight, heightTarget, time));
            setTime(time => time + delta);

        }
        
        if (flag == "x") {
            console.log(time + ", " + height + ", " + oldHeight + ", " + heightTarget);
        }
        
        
    })


    const props: HistogramColumnProps = {
        meshProps: meshProps,
        height: height,
        xWidth: xWidth,
        yWidth: yWidth
    };
    return <HistogramColumn {...props}></HistogramColumn>;
}

function Lerp(from: number, to: number, t: number) {
    const t_real = Math.max(0, Math.min(1, t));
    //t_real = t_real * t_real * (3.0 - 2.0 * t_real)
    return to * t_real + from * (1-t_real)
}

