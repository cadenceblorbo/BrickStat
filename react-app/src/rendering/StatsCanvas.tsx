import { Canvas, type ThreeEvent, type ThreeElements} from '@react-three/fiber';
import { type ReactElement, useRef, useEffect} from 'react';
import * as THREE from 'three';
import { Histogram3D } from "./Histogram3D";


interface StatsCanvasProps {
    data: { [key: string]: number };
    cam?: ReactElement;
    className?: string;
    rows: number;
    cols: number;
    xAxisLabel: string;
    yAxisLabel: string;
    headerLabel: string;
    padding?: number;
    colWidth?: number;
    rowWidth?: number;
    defaultHeight?: number;
    heightScaling?: (dataVal: number) => number;
    barMat?: THREE.Material;
    materialChange?: (mat: THREE.Material | THREE.Material[], height: number, row: number, col: number, isEmpty: boolean) => void;
    cameraControls?: ReactElement;
    colPointerOver?: (e: ThreeEvent<PointerEvent>) => void;
    colPointerOut?: (e: ThreeEvent<PointerEvent>) => void;
    accessibilityLabel: string;
    columnPostProcess?: (e: ReactElement<ThreeElements['mesh']>) => ReactElement;
}

function StatsCanvas({
    data,
    cam,
    className = "",
    rows,
    cols,
    xAxisLabel,
    yAxisLabel,
    headerLabel,
    padding = 0.5,
    colWidth = 1,
    rowWidth = 1,
    defaultHeight = 0.1,
    heightScaling = (dataVal: number) => { return dataVal; },
    barMat = new THREE.MeshStandardMaterial({ color: new THREE.Color().setHex(0xA0A19F) }),
    materialChange = () => { },
    cameraControls,
    colPointerOver = () => { },
    colPointerOut = () => { },
    accessibilityLabel,
    columnPostProcess = (e) => { return e; }
}: StatsCanvasProps) {

    if (cameraControls === undefined) {
        cameraControls = <></>;
    }

    const canvasRef = useRef<HTMLCanvasElement>(null!);

    useEffect(() => {
        if (!canvasRef) {
            return;
        }
        canvasRef.current.role = "img";
        canvasRef.current.ariaLabel = accessibilityLabel;
    }, [canvasRef, accessibilityLabel]);

    

    return (
        <Canvas
            ref={canvasRef} className={className} tabIndex={0}
        >
            <ambientLight intensity={0.5} />
            <directionalLight position={[-7.5, 5, 10]} intensity={Math.PI} />
            <pointLight position={[37.5, 0, 50]} decay={0} intensity={Math.PI / 3} />
            <pointLight position={[-22.5, 15, -30]} decay={0} intensity={Math.PI / 2} />
            <Histogram3D
                rows={rows}
                cols={cols}
                data={data}
                heightScaling={heightScaling}
                material={barMat}
                materialChange={materialChange}
                xAxisLabel={xAxisLabel}
                yAxisLabel={yAxisLabel}
                headerLabel={headerLabel}
                padding={padding}
                colWidth={colWidth}
                rowWidth={rowWidth}
                defaultHeight={defaultHeight}
                colPointerOver={colPointerOver}
                colPointerOut={colPointerOut}
                columnPostProcess={columnPostProcess}
            />
            {cam}
            {cameraControls}
        </Canvas>
            
    );
};

export default StatsCanvas;