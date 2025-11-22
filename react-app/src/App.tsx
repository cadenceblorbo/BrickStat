import { useState } from 'react'
import { StatsCanvas } from './rendering/StatsCanvas.tsx'
import LabeledDropdown from './react-components/LabeledDropdown.tsx'
import * as JSONParse from './json-parser.ts'
import * as THREE from 'three';
import './App.css'



function App() {
    const data = JSONParse.retrieveData()
    console.log(data.dataset)

    const [chronoType, setChronoType] = useState("Cumulative");
    const [yearVal, setYearVal] = useState(data[chronoType].firstYear);
    const currentData = data[chronoType]

    function sliderYearChange(event: { currentTarget: { value: string; }; }) {
        setYearVal(Number(event.currentTarget.value));
    }

    function buttonYearChange(change: number) {
        const newYear = Math.min(Math.max(yearVal + change, currentData.firstYear), currentData.lastYear);
        if (newYear != yearVal) {
            setYearVal(newYear);
        }
    }

    const cam = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    cam.position.x = 7
    cam.position.y = 30
    cam.updateProjectionMatrix();

    

    return (<div>
        <div className = "stats-canvas-parent">
            <StatsCanvas xCols={currentData.xCols} yCols={currentData.yCols} cam={cam} data={currentData.dataset[yearVal]} xAxisLabel={"Stud Length"} yAxisLabel={"Stud Width"} headerLabel={"temp" } />
        </div>
        <div className = "year-controls">
            <input className="year-slider" type="range" min={currentData.firstYear} max={currentData.lastYear} onChange={sliderYearChange} value={yearVal}></input>
            <button className ="year-button" onClick={() => {buttonYearChange(-1)} }>{"<"}</button>
            <p>{yearVal}</p>
            <button className="year-button" onClick={() => { buttonYearChange(1) }}>{">"}</button>
        </div>
        <div>
            <LabeledDropdown label={"Time Format"} values={["Cumulative", "By Year"]} selected={chronoType} onChange={setChronoType} />
        </div>
        
    </div>)
}

export default App
