import { extend, useThree, type ThreeElement } from '@react-three/fiber'
import { RefObject } from 'react'
import { OrbitControls } from 'three/addons'

declare module '@react-three/fiber' {
    interface ThreeElements {
        orbitControls: ThreeElement<typeof OrbitControls>
    }
}

extend({OrbitControls})

interface CameraControlProps {
    ref?: RefObject<OrbitControls>
}

function CameraControls({
    ref 
}: CameraControlProps) {
    const { camera, gl} = useThree()
    return <orbitControls
        ref={ref}
        args={[camera, gl.domElement]}
        target={[0, 0, 0]}
        maxPolarAngle={Math.PI/2}
    />
}

export default CameraControls