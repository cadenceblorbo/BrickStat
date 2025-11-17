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
    yCols: number
}

export function StatsCanvas({
    data,
    cam,
    xCols,
    yCols
}: StatsCanvasProps) {
    

    const mat1 = new THREE.MeshStandardMaterial({ color: 'green' });
    const mat2 = new THREE.MeshStandardMaterial({ color: 'black', side: THREE.DoubleSide});
    const mat3 = new THREE.MeshStandardMaterial({ color: 'gray' });

    const onDataPresent = (props: HistogramColumnProps, dataVal: unknown): void => {
        props.height = Math.max(Math.log(Number(dataVal)), 0.1)
        props.meshProps.material = mat1
    }
    const onDataAbsent = (props: HistogramColumnProps, i: number, j: number): void => {
        props.height = 0.1
        if (i > j) {
            props.meshProps.material = mat2
        } else {
            props.meshProps.material = mat3
        }
    }

    

    return (
        <Canvas className="stats-canvas" camera={cam}>
            <ambientLight intensity={Math.PI / 2} />
            <pointLight position={[10, 10, 10]} decay={0} intensity={Math.PI} />
            <Histogram3D xCols={xCols} yCols={yCols} data={data} onDataPresent={onDataPresent} onDataAbsent={onDataAbsent} />
            <CameraControls/>
        </Canvas>
    )
}
