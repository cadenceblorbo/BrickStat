import { PerspectiveCamera  }from 'three';
import { useFrame } from '@react-three/fiber';

function CameraToy() {
    let dir = 1;
    const min = 20;
    const max = 120;
    const speed = 10;
    useFrame((state, delta) => {
        if (state.camera instanceof PerspectiveCamera) {
            console.log("here");
            if (state.camera.fov > max) {
                dir = -1;
            } else if (state.camera.fov < min) {
                dir = 1;
            }
            state.camera.fov += delta * dir * speed;
            state.camera.updateProjectionMatrix();
        }
    });
    return <></>;
}

export default CameraToy;