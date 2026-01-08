import { useState, useRef, useEffect, useReducer } from 'react';
import { type ThreeElements, useFrame, useThree } from "@react-three/fiber";
import { Vector3, Mesh } from "three";

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
    animSpeed?: number;
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
    handleHeightChange = () => { },
    animSpeed = 0.1,
    xWidth = 1,
    yWidth = 1,
    flag = "",
}: AnimatedColumnProps) {
    if (animSpeed === 0) {
        animSpeed = 0.0000001;
    }
    const time = useRef(0);
    const meshRef = useRef<Mesh>(null!);

    useEffect(() => {
        time.current = 0;
    }, [heightTarget])

    useFrame((state, delta) => {
        if (time.current < 1) {
            delta = delta * (1 / animSpeed);
            time.current += delta;
            const height = Smoothstep(heightStart, heightTarget, time.current);

            meshRef.current.position.y = height / 2 + ((meshProps?.position as Vector3).y as number || 0);
            meshRef.current.scale.y = height;

            handleHeightChange(height);
        }
    })

    let usedPosition = meshProps?.position as Vector3 || new Vector3(0, 0, 0);
    usedPosition = new Vector3(usedPosition.x, usedPosition.y + heightStart / 2, usedPosition.z);
    const newProps = { ...meshProps, position: usedPosition }
    return <mesh ref={meshRef}
        {...newProps}
    >
        <boxGeometry args={[xWidth, 1, yWidth]} />
    </mesh>
}

function Smoothstep(from: number, to: number, t: number) {
    let t_real = Math.max(0, Math.min(1, t));
    t_real = t_real * t_real * (3.0 - 2.0 * t_real)
    return to * t_real + from * (1-t_real)
}

