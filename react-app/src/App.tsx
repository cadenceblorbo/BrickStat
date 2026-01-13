import { useState, useRef } from 'react'
import * as THREE from 'three';

import { StatsCanvas } from './rendering/StatsCanvas.tsx'
import LabeledDropdown from './react-components/LabeledDropdown.tsx'
import { GraphTitle } from './graph-title.ts'
import * as JSONParse from './json-parser.ts'
import { colorLerp3 } from './utils/ColorUtil.ts'
import CameraControls from "./rendering/CameraControls.tsx"
import './App.css'
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import {PerspectiveCamera, OrthographicCamera } from '@react-three/drei'

const CUMULATIVE_LINEAR_HEIGHT_DIVISOR = 1000;
const BY_YEAR_HEIGHT_DIVISOR = 100;
const DEFAULT_BAR_HEIGHT = 0.1;

//73dca1
//4b9f4a
//237841
const COLOR_1 = new THREE.Color().setHex(0x60ba76);
const COLOR_2 = new THREE.Color().setHex(0x4b9f4a);
const COLOR_3 = new THREE.Color().setHex(0x237841);

function App() {
    const data = JSONParse.retrieveData()

    const [chronoType, setChronoType] = useState("Cumulative");
    const [quantityType, setQuantityType] = useState("Total Quantity");
    const [partType, setPartType] = useState("Bricks");
    const [scalingType, setScalingType] = useState("Logarithmic");
    const [cameraType, setCameraType] = useState("Perspective");
    const currentData = data[partType][quantityType][chronoType];
    const [yearVal, setYearVal] = useState(currentData.firstYear);
    const camControlsRef = useRef<OrbitControls>(null!);
    
    function buttonResetCamera() {
        camControlsRef.current.reset();
    }

    function sliderYearChange(event: { currentTarget: { value: string; }; }) {
        setYearVal(Number(event.currentTarget.value));
    }

    function buttonYearChange(change: number) {
        const newYear = Math.min(Math.max(yearVal + change, currentData.firstYear), currentData.lastYear);
        if (newYear != yearVal) {
            setYearVal(newYear);
        }
    }

    function heightScaling(dataVal: number): number {
        if (scalingType == "Linear") {
            switch (chronoType) {
                case "Cumulative":
                    dataVal /= CUMULATIVE_LINEAR_HEIGHT_DIVISOR;
                    break;
                case "By Year":
                    dataVal /= BY_YEAR_HEIGHT_DIVISOR;
                    break;
                default:
                    break;
            }
        } else {
            dataVal = Math.log2(dataVal)
        }
        
        return Math.max(DEFAULT_BAR_HEIGHT, dataVal);
    }

    
    function materialChange(mat: THREE.Material | THREE.Material[], height: number, row: number, col: number, isEmpty: boolean): void {
        if (isEmpty) {
            if (row > col) {
                (mat as THREE.MeshStandardMaterial).color = new THREE.Color().setHex(0x42423e);
            } else {
                (mat as THREE.MeshStandardMaterial).color = new THREE.Color().setHex(0x6c6e68);
            }
        }
        else {
            const heightDiv = (scalingType === "Linear") ? 20 : 6;
            const midpoint = (scalingType === "Linear") ? 0.25 : 0.8;
            (mat as THREE.MeshStandardMaterial).color = colorLerp3(
                COLOR_1,
                COLOR_2,
                COLOR_3,
                height/heightDiv,
                midpoint
            )
        }
    }

    function cameraChange(kind: string) {
        setCameraType(kind);
        camControlsRef.current.reset();
    }

    
    const perspectiveCam = <PerspectiveCamera
        position={[0, 30, 7]}
        fov={75}
        makeDefault={true}>
    </PerspectiveCamera>

    const orthographicCam = <OrthographicCamera
        position={[0, 9000, 0]}
        far={10000}
        zoom={Math.sqrt(Math.min(window.innerWidth, window.innerHeight) / 2) / 1.5}
        makeDefault={true}>
    </OrthographicCamera>

    return (<div>
        <div className = "stats-canvas-parent">
            <StatsCanvas
                xCols={currentData.xCols}
                yCols={currentData.yCols}
                cam={cameraType === "Perspective" ? perspectiveCam : orthographicCam}
                data={currentData.dataset[yearVal]}
                xAxisLabel={"Stud Length"}
                yAxisLabel={"Stud Width"}
                headerLabel={GraphTitle(partType, quantityType, chronoType)}
                defaultHeight={DEFAULT_BAR_HEIGHT}
                heightScaling={heightScaling}
                barMat={new THREE.MeshStandardMaterial({ color: new THREE.Color().setHex(0xA0A19F) })}
                materialChange={materialChange}
                cameraControls={<CameraControls ref={camControlsRef }></CameraControls>}
            />
        </div>
        <div className = "year-controls">
            <input className="year-slider" type="range" min={currentData.firstYear} max={currentData.lastYear} onChange={sliderYearChange} value={yearVal}></input>
            <button className="year-button" onClick={() => {buttonYearChange(-1)} }>{"<"}</button>
            <p>{yearVal}</p>
            <button className="year-button" onClick={() => { buttonYearChange(1) }}>{">"}</button>
        </div>
        <div className="dataset-selection-parent">
            <LabeledDropdown label={"Part Types"} values={["Bricks"]} selected={partType} onChange={setPartType} />
            <LabeledDropdown label={"Quantity Format"} values={["Total Quantity", "Set Apperances"]} selected={quantityType} onChange={setQuantityType} />
            <LabeledDropdown label={"Time Format"} values={["Cumulative", "By Year"]} selected={chronoType} onChange={setChronoType} />
            <LabeledDropdown label={"Vertical Scaling"} values={["Logarithmic", "Linear"]} selected={scalingType} onChange={setScalingType} />
        </div>
        <div className="camera-selection-parent">
            <LabeledDropdown label={"Camera Type"} values={["Perspective", "Orthographic"]} selected={cameraType} onChange={cameraChange} />
            <button className="camera-button" onClick={buttonResetCamera}>{"Reset Camera"}</button>
        </div>
        
    </div>)
}

export default App
