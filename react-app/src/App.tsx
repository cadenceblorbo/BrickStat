import { useState } from 'react'
import { StatsCanvas } from './rendering/StatsCanvas.tsx'
import * as JSONParse from './json-parser.ts'

function App() {
    const data = JSONParse.retrieveData()

    const [sliderVal, setSliderVal] = useState(data.firstYear);

    function handleSliderChange(event: { currentTarget: { value: any; }; }) {
        setSliderVal(event.currentTarget.value);
    }

    return (<div>
        <StatsCanvas xCols={data.xCols} yCols={data.yCols} data={data.cumulative[sliderVal]} />
        <input type="range" min={data.firstYear} max={data.lastYear} onChange={handleSliderChange} defaultValue={sliderVal}></input>        
    </div>)
}

export default App
