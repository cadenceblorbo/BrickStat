import * as THREE from 'three';
import { useState, useRef } from 'react'
import { useFrame, type ThreeElements } from '@react-three/fiber'

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
            <meshStandardMaterial color={hover ? 'hotpink' : 'blue'} />
        </mesh>
    )
}
export default InteractableBoxMesh