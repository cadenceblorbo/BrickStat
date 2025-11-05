import * as THREE from 'three';
import { useState, useRef } from 'react'
import { Canvas, useFrame, type ThreeElements } from '@react-three/fiber'

function InteractableBoxMesh(props: ThreeElements['mesh']) {
    const meshRef = useRef<THREE.Mesh>(null!);
    const [hover, setHover] = useState(false);
    const [active, setActive] = useState(false);
    useFrame((state, delta) => (meshRef.current.rotation.x += delta));
    return (
        <mesh
            {...props}
            ref={meshRef}
            scale={active ? 1.5 : 1}
            onClick={() => setActive(!active)}
            onPointerOver={() => setHover(true)}
            onPointerOut={() => setHover(false)}
        >
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={hover ? 'hotpink' : 'blue'}/>
        </mesh>
    )
}

function CameraToy() {
    let dir = 1
    const min = 20
    const max = 120
    const speed = 10
    useFrame((state, delta) => {
        if (state.camera instanceof THREE.PerspectiveCamera) {
            console.log("here");
            if (state.camera.fov > max) {
                dir = -1
            } else if (state.camera.fov < min) {
                dir = 1
            }
            state.camera.fov += delta * dir * speed;
            state.camera.updateProjectionMatrix();
        }
    });
    return <></>
}

function StatsCanvas() {
    
    
    return (
        <div>
            <Canvas>
                
                <ambientLight intensity={Math.PI / 2} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
                <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
                <InteractableBoxMesh position={[-1.2, 0, 0]} />
                <InteractableBoxMesh position={[1.2, 0, 0]} />
                <CameraToy></CameraToy>
            </Canvas>
        </div>
    )
}

export default StatsCanvas;