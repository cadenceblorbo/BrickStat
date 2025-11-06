import * as THREE from 'three';
import { Canvas } from '@react-three/fiber'
//import CameraToy from "./CameraToy"
//import InteractableBoxMesh from "./InteractableBoxMesh"
import { Histogram3D, type HistogramColumnProps } from "./Histogram3D"
import CameraControls from "./CameraControls"

function StatsCanvas() {
    const cam = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    cam.position.z = 5
    cam.updateProjectionMatrix();

    const onDataPresent = (props: HistogramColumnProps, dataVal: unknown): void => {
        props.height = Number(dataVal)
        console.log("banana")
        props.meshProps.material = new THREE.MeshStandardMaterial({color: 'green'})
    }
    const onDataAbsent = (props: HistogramColumnProps, i: number, j: number): void => {
        props.height = 0.1
        if (i > j) {
            props.meshProps.material = new THREE.MeshStandardMaterial({ color: 'black' })
        } else {
            props.meshProps.material = new THREE.MeshStandardMaterial({ color: 'white' })
        }
    }
    const data: { [key: string]: string } = {}
    const x = 5
    const y = 5
    for (let i = 0; i < x; i++) {
        for (let j = i; j < y; j++) {
            data[(i+1)+","+(j+1)] = i + j + ""
        }
    }
    delete data["1,1"]
    
    return (
        <div>
            <Canvas camera={cam}>
                <ambientLight intensity={Math.PI / 2} />
                <pointLight position={[10, 10, 10]} decay={0} intensity={Math.PI} />
                <Histogram3D xCols={x} yCols={y} data={data} onDataPresent={onDataPresent} onDataAbsent={onDataAbsent} />
                <CameraControls/>
            </Canvas>
        </div>
    )
}

export default StatsCanvas;