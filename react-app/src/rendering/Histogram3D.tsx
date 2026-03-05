import { extend, type ThreeElement, type ThreeEvent } from "@react-three/fiber";
import { useRef } from 'react';
import { MeshBasicMaterial, Vector3, type Material } from "three";
import { TextGeometry, type TextGeometryParameters } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader, type FontData } from 'three/addons/loaders/FontLoader.js';
import Inter from '../assets/Inter_Regular.json';

import { AnimatedHistogramColumn, type AnimatedColumnProps } from './HistogramColumn.tsx';

declare module '@react-three/fiber' {
    interface ThreeElements {
        textGeometry: ThreeElement<typeof TextGeometry>
    }
}

extend({ TextGeometry });

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
    rows: number;
    cols: number;
    xAxisLabel: string;
    yAxisLabel: string;
    headerLabel: string;
    rowWidth: number;
    colWidth: number;
    rowOffset: number;
    colOffset: number;
    padding: number;
}

function Histogram3DLabels({
    rows,
    cols,
    xAxisLabel,
    yAxisLabel,
    headerLabel,
    rowWidth,
    colWidth,
    rowOffset,
    colOffset,
    padding
}: Histogran3DLabelsProps) {
    const colNumberSize = colWidth * 0.8;
    const rowNumberSize = rowWidth * 0.8;
    //const rotationHorizontal: [number, number, number] = [3 * Math.PI / 2, 0, Math.PI / 2];
    //const rotationVertical: [number, number, number] = [3* Math.PI / 2, 0, Math.PI];
    const rotationHorizontal: [number, number, number] = [3*Math.PI / 2, 0, 0];
    const rotationVertical: [number, number, number] = [3 * Math.PI / 2, 0, Math.PI/2];

    const labels = [];
    
    //x axis labels
    const xLabelOffset = (rowOffset - 0.5) * (rowWidth + padding) - (colNumberSize) * 0.75;
    for (let i = 0; i < cols; i++) {
        const numberPos: [number, number, number] = [
            (colOffset + i) * (colWidth + padding),
            0,
            xLabelOffset
        ];
        labels.push(makeTextMesh(String(i+1), colNumberSize, numberPos, rotationHorizontal, i+rows));
    }

    //y axis labels
    const yLabelOffset = (colOffset - 0.5) * (colWidth + padding) - (rowNumberSize) * 0.75 ;
    for (let i = 0; i < rows; i++) {
        const numberPos: [number, number, number] = [
            yLabelOffset,
            0,
            (rowOffset + i) * (rowWidth + padding),
        ];
        labels.push(makeTextMesh(String(i + 1), rowNumberSize, numberPos, rotationHorizontal, i));
    }

    const axisLabelSize = (rowWidth + colWidth) / 2;
    const xLabelPos: [number, number, number] = [
        0,
        0,
        xLabelOffset - padding - axisLabelSize*1.5
    ];
    const yLabelPos: [number, number, number] = [
        yLabelOffset - padding - axisLabelSize*1.5,
        0,
        0
    ];
    const headerPos: [number, number, number] = [
        0,
        0,
        xLabelPos[2] - (axisLabelSize * 2 + padding)
    ];

    labels.push(makeTextMesh(xAxisLabel, axisLabelSize, xLabelPos, rotationHorizontal, rows + cols));
    labels.push(makeTextMesh(yAxisLabel, axisLabelSize, yLabelPos, rotationVertical, rows + cols + 1));
    labels.push(makeTextMesh(headerLabel, 2 * axisLabelSize, headerPos, rotationHorizontal, rows + cols + 2));

    return <>{labels}</>;
}



interface Histogram3DProps {
    rows: number;
    cols: number;
    data: { [key: string]: number };
    heightScaling?: (dataVal: number) => number;
    material: Material;
    materialChange?: (mat: Material | Material[], height: number, row:number, col:number, isEmpty: boolean) => void;
    xAxisLabel?: string;
    yAxisLabel?: string;
    headerLabel?: string;
    colWidth: number;
    rowWidth: number;
    colPointerOver?: (e: ThreeEvent<PointerEvent>) => void;
    colPointerOut?: (e: ThreeEvent<PointerEvent>) => void;
    defaultHeight: number;
    padding: number;
}

export function Histogram3D({
    rows,
    cols,
    data,
    heightScaling = (dataVal) => { return dataVal; },
    material,
    materialChange = () => { },
    xAxisLabel = "X Axis",
    yAxisLabel = "Y Axis",
    headerLabel = "Histogram3D",
    colWidth,
    rowWidth,
    defaultHeight,
    padding,
    colPointerOver = () => { },
    colPointerOut = () => { }
}: Histogram3DProps) {

    const heights = useRef<Map<string,number>>(new Map);

    const rowOffset = -(rows - 1) / 2;
    const colOffset = -(cols - 1) / 2;

    //create columns
    const grid = [];
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            //grid position
            const rowPos = (rowOffset + i) * (rowWidth + padding);
            const colPos = (colOffset + j) * (colWidth + padding);
            const key = (i + 1) + "x" + (j + 1);
            if (!heights.current.has(key)) {
                heights.current.set(key, defaultHeight);
            }
            const props: AnimatedColumnProps = {
                row: i+1,
                col: j+1,
                meshProps: { position: new Vector3(colPos, 0, rowPos), material: material.clone(), onPointerOver: colPointerOver, onPointerOut: colPointerOut },
                heightStart: heights.current.get(key),
                heightTarget: (key in data) ? heightScaling(data[key]) : defaultHeight,
                trackHeightChange: (h: number) => {
                    heights.current.set(key, h);
                },
                materialChange: materialChange,
                xWidth: colWidth,
                yWidth: rowWidth,
                isEmpty: !(key in data),
            };

            //if (i == 1 && j == 5) {
            //    props.flag = 'x';
            //}

            grid.push(<AnimatedHistogramColumn
                {...props}
                key={i * cols + j}
            />);
        }
    }

    return (<>
        {grid}
        <Histogram3DLabels
            rows={rows}
            cols={cols}
            xAxisLabel={xAxisLabel}
            yAxisLabel={yAxisLabel}
            headerLabel={headerLabel}
            rowWidth={rowWidth}
            colWidth={colWidth}
            rowOffset={rowOffset}
            colOffset={colOffset}
            padding={padding}
        />
    </>);
}
