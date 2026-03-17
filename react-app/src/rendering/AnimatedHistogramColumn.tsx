import { useFrame, type ThreeElements} from "@react-three/fiber";
import { useEffect, useRef, type ReactElement, useMemo } from 'react';
import { Material, Mesh, Vector3 } from "three";
import { A11y } from '@react-three/a11y';

import { Smoothstep } from "../utils/MathUtil";

const FRAMERATE = 60;

export interface HistogramColumnProps {
    meshProps: ThreeElements['mesh'];
    height?: number;
    xWidth?: number;
    yWidth?: number;
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
    columnPostProcess?: (e: ReactElement<ThreeElements['mesh']>) => ReactElement;
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
    animSpeed = 0.2,
    xWidth = 1,
    yWidth = 1,
    isEmpty,
    flag = "",
    columnPostProcess = (e) => { return e; }
}: AnimatedColumnProps) {
    if (animSpeed === 0) {
        animSpeed = 0.0000001;
    }
    const time = useRef(0);
    const nextFrame = useRef(1 / FRAMERATE);
    const meshRef = useRef<Mesh>(null!);
    let frameHappened = false;

    const geom = useMemo(() => {
        return <boxGeometry></boxGeometry>;
    }
        , []);

    const newProps = useMemo(() => {
        let usedPosition = meshProps?.position as Vector3 || new Vector3(0, 0, 0);
        usedPosition = new Vector3(usedPosition.x, usedPosition.y + heightStart / 2, usedPosition.z);
        return { ...meshProps, position: usedPosition, scale: new Vector3(xWidth, heightStart, yWidth) };
    }, [heightStart, meshProps, xWidth, yWidth]);

    useEffect(() => {
        time.current = 0;
        nextFrame.current = 0;
    }, [heightTarget]);

    useEffect(() => {
        materialChange(meshRef.current.material, meshRef.current.position.y, row, col, isEmpty);
    }, [meshProps, row, col, isEmpty, materialChange]);

    useFrame((state, delta) => {

       if (time.current < 1 || !frameHappened) {
            delta = delta * (1 / animSpeed);
            time.current += delta;
           if (time.current >= nextFrame.current) {
               nextFrame.current += 1 / FRAMERATE;
               const height = Smoothstep(heightStart, heightTarget, time.current);

               meshRef.current.position.y = height / 2 + ((meshProps?.position as Vector3).y as number || 0);
               meshRef.current.scale.y = height;

               materialChange(meshRef.current.material, meshRef.current.position.y, row, col, isEmpty);
               trackHeightChange(height);
               //if (flag === "x") {
               //    console.log(height)
               //}
               frameHappened = true;
           }
            
        }
    });

   
    let result = <mesh ref={meshRef}
        {...newProps}
        name={row + "x" + col}
        key={"1" }
    >
        {geom}
    </mesh>;

    result = columnPostProcess(result);

    return result;
}



