import {type ThreeElements, extend, type ThreeElement} from "@react-three/fiber";
import { Vector3, MeshBasicMaterial} from "three";
import { FontLoader, type FontData, Font } from 'three/addons/loaders/FontLoader.js';
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

function centeredTextGeometry(text: string, textOptions: TextGeometryParameters): TextGeometry {
    const textGeometry = new TextGeometry(text, textOptions);
    textGeometry.computeBoundingBox();
    textGeometry.center();
    return textGeometry;
}

function makeTextMesh(
    text: string,
    textSize: number,
    position: [number,number,number],
    rotation: [number,number, number],
    key: number
) {
    const textGeometry = centeredTextGeometry(text, {
        font: font,
        size: textSize,
        depth: 0
    });
    return <mesh
        key={key}
        position={position}
        rotation={rotation}
        geometry={textGeometry}
        {...{ material: textMaterial }}
    >
    </mesh>;
}

interface Histogran3DLabelsProps {
    xCols: number;
    yCols: number;
    xAxisLabel: string;
    yAxisLabel: string;
    headerLabel: string;
    colWidthX: number;
    colWidthY: number;
    xOffset: number;
    yOffset: number;
    padding: number;
}

function Histogram3DLabels({
    xCols,
    yCols,
    xAxisLabel,
    yAxisLabel,
    hearderLabel,
    colWidthX,
    colWidthY,
    xOffset,
    yOffset,
    padding
}: Histogran3DLabelsProps) {
    const xNumberSize = colWidthX * 0.8;
    const yNumberSize = colWidthY * 0.8;
    const rotationHorizontal: [number, number, number] = [3 * Math.PI / 2, 0, Math.PI / 2];
    const rotationVertical: [number, number, number] = [3* Math.PI / 2, 0, Math.PI];

    const labels = [];
    for (let i = 0; i < xCols; i++) {
        const numberPos: [number, number, number] = [
            (xOffset + i) * (colWidthX + padding),
            0,
            (-yOffset + 1) * (colWidthY + padding)
        ]
        labels.push(makeTextMesh(String(i+1), xNumberSize, numberPos, rotationHorizontal, i));
    }

    for (let i = 0; i < yCols; i++) {
        const numberPos: [number, number, number] = [
            (xOffset - 1) * (colWidthX + padding),
            0,
            (yOffset + (yCols - i - 1)) * (colWidthY + padding)
        ]
        labels.push(makeTextMesh(String(i+1), yNumberSize, numberPos, rotationHorizontal, i+xCols));
    }

    const axisLabelSize = (colWidthX + colWidthY) / 2;
    const xLabelPos: [number, number, number] = [
        (xOffset - 1) * (colWidthX + padding) - ((xNumberSize) + 0.5 * axisLabelSize),
        0,
        0
    ]
    const yLabelPos: [number, number, number] = [
        0,
        0,
        (-yOffset + 1) * (colWidthY + padding)  + ((yNumberSize) + 0.5 * axisLabelSize)
    ]

    labels.push(makeTextMesh(xAxisLabel, axisLabelSize, xLabelPos, rotationHorizontal, xCols + yCols));
    labels.push(makeTextMesh(yAxisLabel, axisLabelSize, yLabelPos, rotationVertical, xCols + yCols + 1));

    return <>{labels}</>
}



interface Histogram3DProps {
    xCols: number;
    yCols: number;
    data: { [key: string]: number };
    onDataPresent: (props: HistogramColumnProps, dataVal: unknown, i: number, j: number) => void;
    onDataAbsent: (props: HistogramColumnProps, i: number, j: number) => void;
    xAxisLabel: string;
    yAxisLabel: string;
    headerLabel: string;
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
    xAxisLabel = "X Axis",
    yAxisLabel = "Y Axis",
    headerLabel = "Histogram3D",
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

    return (<>
        {grid}
        <Histogram3DLabels
            xCols={xCols}
            yCols={yCols}
            xAxisLabel={xAxisLabel}
            yAxisLabel={yAxisLabel}
            headerLabel={headerLabel}
            colWidthX={colWidthX}
            colWidthY={colWidthY}
            xOffset={xOffset}
            yOffset={yOffset}
            padding={padding}
        />
    </>);
}