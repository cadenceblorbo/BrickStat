import { useState, useRef, useEffect, useReducer } from 'react';
import { type ThreeElements, useFrame} from "@react-three/fiber";
import { Vector3, Mesh, Material } from "three";

import { Smoothstep } from "../utils/MathUtil";

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
    row: number,
    col: number,
    meshProps: ThreeElements['mesh'];
    heightStart?: number;
    heightTarget?: number;
    trackHeightChange?: (h: number) => void;
    materialChange?: (mat: Material | Material[], height: number, row: number, col:number, isEmpty: boolean) => void;
    animSpeed?: number;
    xWidth?: number;
    yWidth?: number;
    isEmpty: boolean;
    flag?: string;
}

//function reducer(state, action) {
//    switch
//}

export function AnimatedHistogramColumn({
    row,
    col,
    meshProps,
    heightStart = 1,
    heightTarget = 1,
    trackHeightChange = () => { },
    materialChange = () => { },
    animSpeed = 0.1,
    xWidth = 1,
    yWidth = 1,
    isEmpty,
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

    useEffect(() => {
        materialChange(meshRef.current.material, meshRef.current.position.y, row, col, isEmpty)
    }, [meshProps, row, col, isEmpty, materialChange])

    useFrame((state, delta) => {
        
        if (time.current < 1) {
            delta = delta * (1 / animSpeed);
            time.current += delta;
            const height = Smoothstep(heightStart, heightTarget, time.current);

            meshRef.current.position.y = height / 2 + ((meshProps?.position as Vector3).y as number || 0);
            meshRef.current.scale.y = height;

            materialChange(meshRef.current.material, meshRef.current.position.y, row, col, isEmpty)
            trackHeightChange(height);
            if (flag === "x") {
                console.log(height)
            }
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



