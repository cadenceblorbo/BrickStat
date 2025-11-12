import type { ThreeElements } from "@react-three/fiber";
import { Vector3} from "three";

export interface HistogramColumnProps {
    meshProps: ThreeElements['mesh'];
    height?: number;
    xWidth?: number;
    yWidth?: number;
}

function HistogramColumn({
    meshProps,
    height = 1,
    xWidth = 1,
    yWidth = 1,
}: HistogramColumnProps) {
    let usedPosition = meshProps?.position as Vector3 || new Vector3(0,0,0);
    usedPosition = new Vector3(usedPosition.x, usedPosition.y + height / 2, usedPosition.z);
    const newProps = { ...meshProps, position: usedPosition }
    return <mesh
        {...newProps}
    >
        <boxGeometry args={[xWidth, height, yWidth]} />
    </mesh>
}

interface Histogram3DProps {
    xCols: number;
    yCols: number;
    data: {[key: string]: number};
    onDataPresent: (props: HistogramColumnProps, dataVal:unknown, i: number, j: number) => void;
    onDataAbsent: (props: HistogramColumnProps, i: number, j: number) => void;
    colWidthX?: number;
    colWidthY?: number;
    defaultHeight?: number;
    padding?: number;
}

export function Histogram3D({
    xCols,
    yCols,
    data,
    onDataPresent,
    onDataAbsent,
    colWidthX = 1,
    colWidthY = 1,
    defaultHeight = 1,
    padding = 0.5
}: Histogram3DProps) {
    const grid = [];
    const xOffset = -(xCols - 1) / 2
    const yOffset = -(yCols - 1) / 2
    for (let i = 0; i < xCols; i++) {
        for (let j = 0; j < yCols; j++) {
            //grid position
            const xPos = (xOffset + i) * (colWidthX + padding)
            const yPos = (yOffset + j) * (colWidthY + padding)
            const props: HistogramColumnProps = {
                meshProps: { position: new Vector3(xPos, 0, yPos) },
                height: defaultHeight,
                xWidth: colWidthX,
                yWidth: colWidthY
            };
            const key = (i + 1) + "x" + (j + 1)
            if (key in data) {
                onDataPresent(props, data[key], i, j);
            } else {
                onDataAbsent(props, i, j);
            }

            grid.push(<HistogramColumn
                {...props}
                key={i * yCols + j}
            />)
        }
    }
    return <>{grid}</>;
}