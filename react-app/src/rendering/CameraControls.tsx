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
    const { invalidate, camera, gl } = useThree()
    useEffect(() => {
        const onOrbitChange = () => {
            invalidate()
            
        }
        if (ref !== undefined) {
            ref.current.addEventListener('change', onOrbitChange)
            const orbitRefVal = ref.current
            return () => orbitRefVal.removeEventListener('change', onOrbitChange)
        }
        
    });
    return <orbitControls
        ref={ref}
        args={[camera, gl.domElement]}
        target={[0, 0, 0]}
        maxPolarAngle={Math.PI/2}
    />
}

export default CameraControls