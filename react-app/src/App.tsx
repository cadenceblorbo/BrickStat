import { useState } from 'react'
import { StatsCanvas } from './rendering/StatsCanvas.tsx'
import LabeledDropdown from './react-components/LabeledDropdown.tsx'
import { GraphTitle } from './graph-title.ts'
import * as JSONParse from './json-parser.ts'
import * as THREE from 'three';
import './App.css'

const CUMULATIVE_LINEAR_HEIGHT_DIVISOR = 1000;
const BY_YEAR_HEIGHT_DIVISOR = 100;
const DEFAULT_BAR_HEIGHT = 0.1;

function App() {
    const data = JSONParse.retrieveData()

    const [chronoType, setChronoType] = useState("Cumulative");
    const [quantityType, setQuantityType] = useState("Total Quantity");
    const [partType, setPartType] = useState("Bricks");
    const [scalingType, setScalingType] = useState("Logarithmic")
    const currentData = data[partType][quantityType][chronoType];
    const [yearVal, setYearVal] = useState(currentData.firstYear);
    

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
                (mat as THREE.MeshStandardMaterial).color = new THREE.Color().setHex(0xA0A19f);
            }
        }
    }

    const cam = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    cam.position.x = 7
    cam.position.y = 30
    cam.updateProjectionMatrix();

    

    return (<div>
        <div className = "stats-canvas-parent">
            <StatsCanvas
                xCols={currentData.xCols}
                yCols={currentData.yCols}
                cam={cam}
                data={currentData.dataset[yearVal]}
                xAxisLabel={"Stud Length"}
                yAxisLabel={"Stud Width"}
                headerLabel={GraphTitle(partType, quantityType, chronoType)}
                defaultHeight={DEFAULT_BAR_HEIGHT}
                heightScaling={heightScaling}
                barMat={new THREE.MeshStandardMaterial({ color: new THREE.Color().setHex(0xA0A19F) })}
                materialChange={materialChange}
            />
        </div>
        <div className = "year-controls">
            <input className="year-slider" type="range" min={currentData.firstYear} max={currentData.lastYear} onChange={sliderYearChange} value={yearVal}></input>
            <button className ="year-button" onClick={() => {buttonYearChange(-1)} }>{"<"}</button>
            <p>{yearVal}</p>
            <button className="year-button" onClick={() => { buttonYearChange(1) }}>{">"}</button>
        </div>
        <div className="dataset-selection-parent">
            <LabeledDropdown label={"Part Types"} values={["Bricks"]} selected={partType} onChange={setPartType} />
            <LabeledDropdown label={"Quantity Format"} values={["Total Quantity", "Set Apperances"]} selected={quantityType} onChange={setQuantityType} />
            <LabeledDropdown label={"Time Format"} values={["Cumulative", "By Year"]} selected={chronoType} onChange={setChronoType} />
            <LabeledDropdown label={"Vertical Scaling"} values={["Logarithmic", "Linear"]} selected={scalingType} onChange={setScalingType} />
        </div>
        
    </div>)
}

export default App
