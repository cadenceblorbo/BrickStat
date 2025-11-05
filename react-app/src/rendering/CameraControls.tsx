import { OrbitControls } from 'three/addons'
import { type ThreeElement, useThree, extend } from '@react-three/fiber'
import { useRef, useEffect } from 'react'

declare module '@react-three/fiber' {
    interface ThreeElements {
        orbitControls: ThreeElement<typeof OrbitControls>
    }
}

extend({OrbitControls})

function CameraControls() {
    const orbitControlsRef = useRef<OrbitControls>(null!);
    const { invalidate, camera, gl } = useThree()
    useEffect(() => {
        const onOrbitChange = () => {
            invalidate()
        }
        orbitControlsRef.current.addEventListener('change', onOrbitChange)
        return () => orbitControlsRef.current.removeEventListener('change', onOrbitChange)
    });
    console.log(camera);

    return <orbitControls ref={orbitControlsRef} args={[camera, gl.domElement]} target={[0, 3, 0] } />
}

export default CameraControls