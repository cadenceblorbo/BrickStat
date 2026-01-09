import { useState, useRef } from 'react';
import { extend, type ThreeElement, useFrame } from "@react-three/fiber";
import { Vector3, MeshBasicMaterial, type Material } from "three";
import { FontLoader, type FontData} from 'three/addons/loaders/FontLoader.js';
import { TextGeometry, type TextGeometryParameters } from 'three/addons/geometries/TextGeometry.js';
import Inter from '../assets/Inter_Regular.json'

import {HistogramColumn, AnimatedHistogramColumn, type AnimatedColumnProps, type HistogramColumnProps} from './HistogramColumn.tsx'

declare module '@react-three/fiber' {
    interface ThreeElements {
        textGeometry: ThreeElement<typeof TextGeometry>
    }
}

extend({ TextGeometry })

const loader = new FontLoader;
const font = loader.parse(Inter as unknown as FontData);
const textMaterial = new MeshBasicMaterial();

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
    headerLabel,
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
    //x labels
    for (let i = 0; i < xCols; i++) {
        const numberPos: [number, number, number] = [
            (xOffset + i) * (colWidthX + padding),
            0,
            (-yOffset + 1) * (colWidthY + padding)
        ]
        labels.push(makeTextMesh(String(i+1), xNumberSize, numberPos, rotationHorizontal, i));
    }

    //y labels
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
    const headerPos: [number, number, number] = [
        xLabelPos[0] - (axisLabelSize * 2 + padding),
        0,
        0
    ]

    labels.push(makeTextMesh(xAxisLabel, axisLabelSize, xLabelPos, rotationHorizontal, xCols + yCols));
    labels.push(makeTextMesh(yAxisLabel, axisLabelSize, yLabelPos, rotationVertical, xCols + yCols + 1));
    labels.push(makeTextMesh(headerLabel, 2 * axisLabelSize, headerPos, rotationHorizontal, xCols + yCols + 2));

    return <>{labels}</>
}



interface Histogram3DProps {
    xCols: number;
    yCols: number;
    data: { [key: string]: number };
    heightScaling?: (dataVal: number) => number;
    material: Material;
    materialChange?: (mat: Material | Material[], height: number, row:number, col:number, isEmpty: boolean) => void;
    xAxisLabel?: string;
    yAxisLabel?: string;
    headerLabel?: string;
    colWidthX?: number;
    colWidthY?: number;
    defaultHeight?: number;
    padding?: number;
}

export function Histogram3D({
    xCols,
    yCols,
    data,
    heightScaling = (dataVal) => { return dataVal },
    material,
    materialChange = () => { },
    xAxisLabel = "X Axis",
    yAxisLabel = "Y Axis",
    headerLabel = "Histogram3D",
    colWidthX = 1,
    colWidthY = 1,
    defaultHeight = 0.1,
    padding = 0.5
}: Histogram3DProps) {

    const heights = useRef(Array<number>(xCols).fill(defaultHeight).map(() => new Array<number>(yCols).fill(defaultHeight)));

    const xOffset = -(xCols - 1) / 2
    const yOffset = -(yCols - 1) / 2

    

    //create columns
    const grid = [];
    for (let i = 0; i < xCols; i++) {
        for (let j = 0; j < yCols; j++) {
            //grid position
            const xPos = (xOffset + i) * (colWidthX + padding)
            const yPos = (yOffset + (yCols - j - 1)) * (colWidthY + padding)
            const key = (i + 1) + "x" + (j + 1)
            const props: AnimatedColumnProps = {
                row: i,
                col: j,
                meshProps: { position: new Vector3(xPos, 0, yPos), material: material.clone() },
                heightStart: heights.current[i][j],
                heightTarget: (key in data) ? heightScaling(data[key]) : defaultHeight,
                trackHeightChange: (h: number) => {
                    heights.current[i][j] = h;
                },
                materialChange: materialChange,
                xWidth: colWidthX,
                yWidth: colWidthY,
                isEmpty: !(key in data)
            };

            if (i == 9 && j == 19) {
                props.flag = 'x';
            }

            grid.push(<AnimatedHistogramColumn
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
