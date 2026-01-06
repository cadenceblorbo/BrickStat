import { type ThreeElements, useFrame } from "@react-three/fiber";
import { Vector3 } from "three";

export interface HistogramColumnProps {
    meshProps: ThreeElements['mesh'];
    height?: number;
    xWidth?: number;
    yWidth?: number;
}

export function HistogramColumn({
    meshProps,
    height = 1,
    xWidth = 1,
    yWidth = 1,
}: HistogramColumnProps) {
    let usedPosition = meshProps?.position as Vector3 || new Vector3(0, 0, 0);
    usedPosition = new Vector3(usedPosition.x, usedPosition.y + height / 2, usedPosition.z);
    const newProps = { ...meshProps, position: usedPosition }
    return <mesh
        {...newProps}
    >
        <boxGeometry args={[xWidth, height, yWidth]} />
    </mesh>
}

export interface AnimatedColumnProps {
    meshProps: ThreeElements['mesh'];
    heightStart?: number;
    heightTarget?: number;
    handleHeightChange?: (h: number) => void;
    xWidth?: number;
    yWidth?: number;
}

export function AnimatedHistogramColumn({
    meshProps,
    heightStart = 1,
    heightTarget = 1,
    handleHeightChange = () => { },
    xWidth = 1,
    yWidth = 1,
}: AnimatedColumnProps) {

    let height = heightStart;
    let e = 0;

    useFrame(({ clock }) => {
        e += clock.getDelta()
        console.log(e)
        height = Smoothstep(heightStart, heightTarget, e)
        handleHeightChange(height)
    })

    const props: HistogramColumnProps = {
        meshProps: meshProps,
        height: height,
        xWidth: xWidth,
        yWidth: yWidth
    };
    return <HistogramColumn {...props}></HistogramColumn>;
}

function Smoothstep(from: number, to: number, t: number) {
    let t_real = Math.max(0, Math.min(1, t));
    t_real = t_real * t_real * (3.0 - 2.0 * t_real)
    return from * t_real + to * (1-t_real)
}

