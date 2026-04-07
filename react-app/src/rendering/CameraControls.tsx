import { extend, useThree, type ThreeElement } from '@react-three/fiber';
import { type RefObject, useEffect} from 'react';
import { OrbitControls } from 'three/addons';

declare module '@react-three/fiber' {
    interface ThreeElements {
        orbitControls: ThreeElement<typeof OrbitControls>
    }
}

extend({ OrbitControls });

interface CameraControlProps {
    ref: RefObject<OrbitControls>,
    keyboardDOMCapture?: RefObject<HTMLElement>
}



function CameraControls({
    ref,
    keyboardDOMCapture
}: CameraControlProps) {

    useEffect(() => {

        const currentControls = ref.current;

        const keyboardZoom = (e: KeyboardEvent) => {
            switch (e.key) {
                case '+':
                    currentControls.domElement?.dispatchEvent(new WheelEvent('wheel', { deltaY: -120 }));
                    break;
                case '-':
                    currentControls.domElement?.dispatchEvent(new WheelEvent('wheel', { deltaY: 120 }));
                    break;
            }
        };

        const capture = keyboardDOMCapture && keyboardDOMCapture.current ? keyboardDOMCapture.current : window;
        capture.addEventListener('keydown', keyboardZoom as EventListener);
        currentControls.listenToKeyEvents(capture);

        return () => {
            capture.removeEventListener('keydown', keyboardZoom as EventListener);
            currentControls.stopListenToKeyEvents();
        };
    }, [ref, keyboardDOMCapture]);

    const { camera, gl } = useThree();
    return <orbitControls
        ref={ref}
        args={[camera, gl.domElement]}
        target={[0, 0, 0]}
        maxPolarAngle={Math.PI / 2}
    />;
}

export default CameraControls;