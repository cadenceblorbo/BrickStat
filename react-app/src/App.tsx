import { useState } from 'react'
import { StatsCanvas } from './rendering/StatsCanvas.tsx'
import * as JSONParse from './json-parser.ts'
import * as THREE from 'three';
import './App.css'

function App() {
    const data = JSONParse.retrieveData()

    const [yearVal, setYearVal] = useState(data.firstYear);

    function sliderYearChange(event: { currentTarget: { value: string; }; }) {
        setYearVal(Number(event.currentTarget.value));
    }

    function buttonYearChange(change: number) {
        const newYear = Math.min(Math.max(yearVal + change, data.firstYear), data.lastYear);
        if (newYear != yearVal) {
            setYearVal(newYear);
        }
    }

    const cam = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    cam.position.z = 10
    cam.position.y = 3
    cam.updateProjectionMatrix();
    console.log(window.innerWidth)
    console.log(window.innerHeight)

    return (<div>
        <div className = "stats-canvas-parent">
            <StatsCanvas xCols={data.xCols} yCols={data.yCols} cam={cam} data={data.cumulative[yearVal]} />
        </div>
        <div className = "year-controls">
            <input className="year-slider" type="range" min={data.firstYear} max={data.lastYear} onChange={sliderYearChange} value={yearVal}></input>
            <button onClick={() => {buttonYearChange(-1)} }>{"←"}</button>
            <p>{yearVal}</p>
            <button onClick={() => { buttonYearChange(1) }}>{"→"}</button>
        </div>
        
    </div>)
}

export default App
