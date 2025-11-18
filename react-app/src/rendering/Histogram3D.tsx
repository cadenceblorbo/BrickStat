import {type ThreeElements, extend, type ThreeElement} from "@react-three/fiber";
import { Vector3, MeshBasicMaterial} from "three";
import { FontLoader, type FontData } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry, type TextGeometryParameters } from 'three/addons/geometries/TextGeometry.js';
import Inter from '../assets/Inter_Regular.json'

declare module '@react-three/fiber' {
    interface ThreeElements {
        textGeometry: ThreeElement<typeof TextGeometry>
    }
}

extend({ TextGeometry })

const loader = new FontLoader;
const font = loader.parse(Inter as unknown as FontData);
const textOptions: TextGeometryParameters = {
    font: font,
    size: 0.8,
    depth: 0
}
const textMaterial = new MeshBasicMaterial();

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

function centeredTextGeometry(text: string, textOptions: TextGeometryParameters): TextGeometry {
    const textGeometry = new TextGeometry(text, textOptions);
    textGeometry.computeBoundingBox();
    textGeometry.center();
    return textGeometry;
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
    
    const xOffset = -(xCols - 1) / 2
    const yOffset = -(yCols - 1) / 2

    //create columns
    const grid = [];
    for (let i = 0; i < xCols; i++) {
        for (let j = 0; j < yCols; j++) {
            //grid position
            const xPos = (xOffset + i) * (colWidthX + padding)
            const yPos = (yOffset + (yCols-j-1)) * (colWidthY + padding)
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

    //create labels
    const labels = [];
    for (let i = 0; i < xCols; i++) {
        const textGeometry = centeredTextGeometry(String(i+1), textOptions);
        const textMesh = <mesh
            key={xCols * yCols + i}
            position={[
                (xOffset + i) * (colWidthX + padding),
                0,
                (-yOffset+1) * (colWidthY + padding)
            ]}
            rotation={[3*Math.PI/2, 0, Math.PI/2]}
            geometry = {textGeometry}
            {...{ material: textMaterial }}
        >
        </mesh>;
        labels.push(textMesh);
    }

    for (let i = 0; i < yCols; i++) {
        const textGeometry = centeredTextGeometry(String(i + 1), textOptions);
        const textMesh = <mesh
            key={xCols * yCols + i + xCols}
            position={[
                (xOffset - 1) * (colWidthX + padding),
                0,
                (yOffset + (yCols - i - 1)) * (colWidthY + padding)
            ]}
            rotation={[3 * Math.PI / 2, 0, Math.PI / 2]}
            geometry={textGeometry}
            {...{ material: textMaterial }}
        >
        </mesh>;
        labels.push(textMesh);
    }

    return (<>
        {grid}
        {labels}
    </>);
}