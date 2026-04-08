import { useFrame, type ThreeElements } from '@react-three/fiber';
import { useRef, useState } from 'react';
import { Mesh } from 'three';

function InteractableBoxMesh(props: ThreeElements['mesh']) {
    const meshRef = useRef<Mesh>(null!);
    const [hover, setHover] = useState(false);
    const [active, setActive] = useState(false);
    useFrame((_, delta) => (meshRef.current.rotation.x += delta));
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
    );
}
export default InteractableBoxMesh;