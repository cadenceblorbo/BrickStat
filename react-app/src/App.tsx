import { useState } from 'react'
import { StatsCanvas } from './rendering/StatsCanvas.tsx'
import * as JSONParse from './json-parser.ts'
import * as THREE from 'three';

function App() {
    const data = JSONParse.retrieveData()

    const [sliderVal, setSliderVal] = useState(data.firstYear);

    function handleSliderChange(event: { currentTarget: { value: any; }; }) {
        setSliderVal(event.currentTarget.value);
    }

    const cam = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    cam.position.z = 10
    cam.updateProjectionMatrix();

    return (<div>
        <StatsCanvas xCols={data.xCols} yCols={data.yCols} cam={cam} data={data.cumulative[sliderVal]} />
        <input type="range" min={data.firstYear} max={data.lastYear} onChange={handleSliderChange} defaultValue={sliderVal}></input>        
    </div>)
}

export default App
