import { Canvas, type ThreeEvent } from '@react-three/fiber';
import type { ReactElement } from 'react';
import * as THREE from 'three';
import { Histogram3D } from "./Histogram3D";



interface StatsCanvasProps {
    data: { [key: string]: number };
    cam?: ReactElement;
    className?: string;
    xCols: number;
    yCols: number;
    xAxisLabel: string;
    yAxisLabel: string;
    headerLabel: string;
    defaultHeight?: number;
    heightScaling?: (dataVal: number) => number;
    barMat?: THREE.Material;
    materialChange?: (mat: THREE.Material | THREE.Material[], height: number, row: number, col: number, isEmpty: boolean) => void;
    cameraControls?: ReactElement;
    colPointerOver?: (e: ThreeEvent<PointerEvent>) => void;
    colPointerOut?: (e: ThreeEvent<PointerEvent>) => void;
}

export function StatsCanvas({
    data,
    cam,
    className = "",
    xCols,
    yCols,
    xAxisLabel,
    yAxisLabel,
    headerLabel,
    defaultHeight = 0.1,
    heightScaling = (dataVal: number) => { return dataVal },
    barMat = new THREE.MeshStandardMaterial({ color: new THREE.Color().setHex(0xA0A19F) }),
    materialChange = () => { },
    cameraControls,
    colPointerOver = () => { },
    colPointerOut = () => { }
}: StatsCanvasProps) {

    if (cameraControls === undefined) {
        cameraControls = <></>;
    }
    
    
    return (
        <Canvas className={className}>
            <ambientLight intensity={Math.PI / 2} />
            <directionalLight position={[-7.5, 5, 10]} intensity={Math.PI} />
            <pointLight position={[37.5, 0, 50]} decay={0} intensity={Math.PI / 2} />
            <pointLight position={[-22.5, 2, -30]} decay={0} intensity={Math.PI / 3} />
            <Histogram3D
                xCols={xCols}
                yCols={yCols}
                data={data}
                heightScaling={heightScaling}
                material={barMat}
                materialChange={materialChange}
                xAxisLabel={xAxisLabel}
                yAxisLabel={yAxisLabel}
                headerLabel={headerLabel}
                defaultHeight={defaultHeight}
                colPointerOver={colPointerOver}
                colPointerOut={colPointerOut}
            />
            {cam}
            {cameraControls}
        </Canvas>
    );
}
