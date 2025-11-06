import * as THREE from 'three';
import { Canvas } from '@react-three/fiber'
//import CameraToy from "./CameraToy"
//import InteractableBoxMesh from "./InteractableBoxMesh"
import Histogram3D from "./Histogram3D"
import CameraControls from "./CameraControls"

function StatsCanvas() {
    const cam = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    cam.position.z = 5
    cam.updateProjectionMatrix();
    
    return (
        <div>
            <Canvas camera={cam}>
                <ambientLight intensity={Math.PI / 2} />
                <pointLight position={[10, 10, 10]} decay={0} intensity={Math.PI} />
                <Histogram3D xCols={5} yCols={5} />
                <CameraControls/>
            </Canvas>
        </div>
    )
}

export default StatsCanvas;