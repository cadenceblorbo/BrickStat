import * as THREE from 'three';
import { Canvas } from '@react-three/fiber'
//import CameraToy from "./CameraToy"
//import InteractableBoxMesh from "./InteractableBoxMesh"
import { Histogram3D, type HistogramColumnProps } from "./Histogram3D"
import CameraControls from "./CameraControls"
import * as JSONParse from '../json-parser.ts'

function StatsCanvas() {
    const cam = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    cam.position.z = 5
    cam.updateProjectionMatrix();

    const mat1 = new THREE.MeshStandardMaterial({ color: 'green' });
    const mat2 = new THREE.MeshStandardMaterial({ color: 'black', side: THREE.DoubleSide});
    const mat3 = new THREE.MeshStandardMaterial({ color: 'white' });

    const onDataPresent = (props: HistogramColumnProps, dataVal: unknown, i: number, j: number): void => {
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
    const data: { [key: string]: number } = {}
    const x = 5
    const y = 5
    for (let i = 0; i < x; i++) {
        for (let j = i; j < y; j++) {
            data[(i+1)+","+(j+1)] = i + j
        }
    }
    delete data["1,1"]

    const dataT = JSONParse.retrieveData()
    console.log(dataT.cumulative)

    return (
        <div>
            <Canvas camera={cam}>
                <ambientLight intensity={Math.PI / 2} />
                <pointLight position={[10, 10, 10]} decay={0} intensity={Math.PI} />
                <Histogram3D xCols={dataT.xCols} yCols={dataT.yCols} data={dataT.cumulative[2025]} onDataPresent={onDataPresent} onDataAbsent={onDataAbsent} />
                <CameraControls/>
            </Canvas>
        </div>
    )
}

export default StatsCanvas;