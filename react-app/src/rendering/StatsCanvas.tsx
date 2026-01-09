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
    headerLabel: string
}

export function StatsCanvas({
    data,
    cam,
    xCols,
    yCols,
    xAxisLabel,
    yAxisLabel,
    headerLabel
}: StatsCanvasProps) {
    

    const mat1 = new THREE.MeshStandardMaterial({ color: new THREE.Color().setHex(0x00Af4d) });
    const mat2 = new THREE.MeshStandardMaterial({ color: new THREE.Color().setHex(0x42423e) });
    const mat3 = new THREE.MeshStandardMaterial({ color: new THREE.Color().setHex(0xA0A19F) });

    const materialChange = (mat: THREE.Material | THREE.Material[], height: number, row: number, col: number, isEmpty: boolean) : void => {
        if(row > col) {
            (mat as THREE.MeshStandardMaterial).color = new THREE.Color().setHex(0x42423e);
        }
    }

    return (
        <Canvas className="stats-canvas" camera={cam}>
            <ambientLight intensity={Math.PI / 2} />
            <pointLight position={[10, 10, 10]} decay={0} intensity={Math.PI} />
            <Histogram3D xCols={xCols} yCols={yCols} data={data} material={mat3} materialChange={materialChange } xAxisLabel={xAxisLabel} yAxisLabel={yAxisLabel} headerLabel={headerLabel} />
            <CameraControls/>
        </Canvas>
    )
}
