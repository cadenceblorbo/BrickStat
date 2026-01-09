import * as THREE from 'three';
import { Canvas } from '@react-three/fiber'
//import CameraToy from "./CameraToy"
//import InteractableBoxMesh from "./InteractableBoxMesh"
import { Histogram3D, type HistogramColumnProps } from "./Histogram3D"
import CameraControls from "./CameraControls"



interface StatsCanvasProps {
    data: { [key: string]: number },
    cam: THREE.PerspectiveCamera,
    xCols: number,
    yCols: number,
    xAxisLabel: string,
    yAxisLabel: string,
    headerLabel: string,
    defaultHeight?: number,
    heightScaling?: (dataVal: number) => number
    barMat?: THREE.Material
    materialChange?: (mat: THREE.Material | THREE.Material[], height: number, row: number, col: number, isEmpty: boolean) => void;
}

export function StatsCanvas({
    data,
    cam,
    xCols,
    yCols,
    xAxisLabel,
    yAxisLabel,
    headerLabel,
    defaultHeight = 0.1,
    heightScaling = (dataVal: number) => { return dataVal },
    barMat = new THREE.MeshStandardMaterial({ color: new THREE.Color().setHex(0xA0A19F) }),
    materialChange = () => { }
}: StatsCanvasProps) {

    return (
        <Canvas className="stats-canvas" camera={cam}>
            <ambientLight intensity={Math.PI / 2} />
            <pointLight position={[10, 10, 10]} decay={0} intensity={Math.PI} />
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
            />
            <CameraControls/>
        </Canvas>
    )
}
