import { OrbitControls } from 'three/addons'
import { type ThreeElement, useThree, extend } from '@react-three/fiber'
import { useRef, useEffect, RefObject, createRef } from 'react'
import {PerspectiveCamera } from 'three'

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