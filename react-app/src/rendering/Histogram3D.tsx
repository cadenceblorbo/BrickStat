import type { ThreeElements } from "@react-three/fiber";
import { Vector3 } from "three";

interface HistogramColumnProps {
    meshProps?: ThreeElements['mesh'];
    height: number;
}

function HistogramColumn({ meshProps, height }: HistogramColumnProps) {
    let usedPosition = meshProps?.position as Vector3 || new Vector3(0,0,0);
    usedPosition = new Vector3(usedPosition.x, usedPosition.y + height / 2, usedPosition.z);
    const newProps = {...meshProps, position: usedPosition}
    return <mesh
        {...newProps}
    >
        <boxGeometry args={[1, height, 1]} />
        <meshStandardMaterial color={'green'} />
    </mesh>
}

interface Histogram3DProps {
    xCols: number;
    yCols: number;
    padding?: number;
}

function Histogram3D({xCols, yCols, padding = 0.5}: Histogram3DProps) {
    const grid = [];
    const xOffset = -(xCols - 1) / 2
    const yOffset = -(yCols - 1) / 2
    for (let i = 0; i < xCols; i++) {
        for (let j = 0; j < yCols; j++) {
            //grid position
            const xPos = (xOffset + i) * (1 + padding)
            const yPos = (yOffset + j) * (1 + padding)
            grid.push(<HistogramColumn meshProps={{ position: new Vector3(xPos, 0, yPos) }} height={Math.random() * 5} key={ i*yCols + j} />)
        }
    }
    return <>{grid}</>;
}
export default Histogram3D