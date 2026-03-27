import { OrthographicCamera, PerspectiveCamera } from '@react-three/drei';
import { type ThreeEvent, type ThreeElements } from '@react-three/fiber';
import { useRef, useState, useMemo, useCallback, type ReactElement } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
//import { A11yAnnouncer, A11y } from '@react-three/a11y';
import { A11yAnnouncer } from './a11y/A11yAnnouncer.tsx';
import { A11y } from './a11y/A11y.tsx';



import { GraphTitle } from './graph-title.ts';
import * as JSONParse from './json-parser.ts';
import LabeledColorPicker from './react-components/LabeledColorPicker.tsx';
import LabeledDropdown from './react-components/LabeledDropdown.tsx';
import LabeledTextboxSlider from './react-components/LabeledTextboxSlider.tsx';
import MousePosTooltip from './react-components/MousePosTooltip.tsx';
import CameraControls from "./rendering/CameraControls.tsx";
import StatsCanvas from './rendering/StatsCanvas.tsx';
import { colorLerp3 } from './utils/ColorUtil.ts';
import { ChronoType, PartType, QuantityType } from './utils/lego-enum.ts';
import TooltipContent from './react-components/TooltipContent.tsx';
import { Clamp } from './utils/MathUtil.ts';
import makeBarLabel from './utils/bar-label-factory.ts';
import { useThrottle } from './react-components/Hooks.ts';

const CUMULATIVE_LINEAR_HEIGHT_DIVISOR = 1000;
const BY_YEAR_LINEAR_HEIGHT_DIVISOR = 100;
const tooltipArrowSize = 10;

function Histogram3DApp() {
    const data = useMemo(() => JSONParse.retrieveData(), []);

    const [chronoType, setChronoType] = useState(ChronoType.Cumulative);
    const [quantityType, setQuantityType] = useState(QuantityType.TotalQuantity);
    const [partType, setPartType] = useState(PartType.Bricks);
    const [scalingType, setScalingType] = useState("Logarithmic");
    const [cameraType, setCameraType] = useState("Perspective");
    const currentData = data.histogramData[partType][quantityType][chronoType];
    const [yearVal, setYearVal] = useState(currentData.firstYear);
    const throttledYearVal = useThrottle(yearVal, 100);
    const camControlsRef = useRef<OrbitControls>(null!);
    const canvasParentRef = useRef(null!);

    const lastHoverRef = useRef("");
    const [tooltipVisible, setTooltipVisible] = useState(false);
    const [tooltipContent, setTooltipContent] = useState(<div></div>);
    const [mouseDown, setMouseDown] = useState(false);

    const [advancedOptionsVisible, setAdvancedOptionsVisible] = useState(false);

    const [barColor1, setBarColor1] = useState("#60ba76");
    const [barColor2, setBarColor2] = useState("#4b9f4a");
    const [barColor3, setBarColor3] = useState("#237841");
    const threeBarColor1 = useMemo(() => new THREE.Color(barColor1), [barColor1]);
    const threeBarColor2 = useMemo(() => new THREE.Color(barColor2), [barColor2]);
    const threeBarColor3 = useMemo(() => new THREE.Color(barColor3), [barColor3]);

    const [emptyBarColor, setEmptyBarColor] = useState("#6c6e68");
    const [unusedBarColor, setUnusedBarColor] = useState("#42423e");
    const [impossibleBarColor, setImpossibleBarColor] = useState("#05131D");
    const threeEmptyBarColor = useMemo(() => new THREE.Color(emptyBarColor), [emptyBarColor]);
    const threeUnusedBarColor = useMemo(() => new THREE.Color(unusedBarColor), [unusedBarColor]);
    const threeImpossibleBarColor = useMemo(() => new THREE.Color(impossibleBarColor), [impossibleBarColor]);

    const [linearLerpMidpoint, setLinearLerpMidpoint] = useState(0.25);
    const [logarithmicLerpMidpoint, setLogarithmicLerpMidpoint] = useState(0.8);
    const [linearColorHeightDiv, setLinearColorHeightDiv] = useState(20);
    const [logColorHeightDiv, setLogColorHeightDiv] = useState(6);

    const [colWidth, setColXWidth] = useState(1);
    const [rowWidth, setColYWidth] = useState(1);
    const [defaultHeight, setDefaultHeight] = useState(0.1);
    const [padding, setPadding] = useState(0.5);

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

    const heightScaling = useCallback((dataVal: number): number => {
        if (scalingType == "Linear") {
            switch (chronoType) {
                case ChronoType.Cumulative:
                    dataVal /= CUMULATIVE_LINEAR_HEIGHT_DIVISOR;
                    break;
                case ChronoType.ByYear:
                    dataVal /= BY_YEAR_LINEAR_HEIGHT_DIVISOR;
                    break;
                default:
                    break;
            }
        } else {
            dataVal = Math.log2(dataVal);
        }

        return Math.max(defaultHeight, dataVal);
    }, [chronoType, defaultHeight, scalingType]);

    const materialChange = useCallback((mat: THREE.Material | THREE.Material[], height: number, row: number, col: number, isEmpty: boolean): void => {
        if (isEmpty) {
            if (row > col) {
                (mat as THREE.MeshStandardMaterial).color = threeImpossibleBarColor;
            } else {
                if (data.partLifetimeData[partType].hasPart(row + "x" + col)) {
                    (mat as THREE.MeshStandardMaterial).color = threeEmptyBarColor;
                } else {
                    (mat as THREE.MeshStandardMaterial).color = threeUnusedBarColor;
                }
            }
        }
        else {
            const heightDiv = (scalingType === "Linear") ? linearColorHeightDiv : logColorHeightDiv;
            const midpoint = (scalingType === "Linear") ? linearLerpMidpoint : logarithmicLerpMidpoint;
            (mat as THREE.MeshStandardMaterial).color = colorLerp3(
                threeBarColor1,
                threeBarColor2,
                threeBarColor3,
                height / heightDiv,
                midpoint
            );
        }
    }, [data, linearColorHeightDiv, logColorHeightDiv, partType, linearLerpMidpoint, logarithmicLerpMidpoint, scalingType, threeBarColor1, threeBarColor2, threeBarColor3, threeEmptyBarColor, threeUnusedBarColor, threeImpossibleBarColor]);

    const getCurrentValue = useCallback((name: string) => {
        if (name in currentData.dataset[throttledYearVal + ""]) {
            return currentData.dataset[throttledYearVal + ""][name];
        }
        return 0;
    }, [throttledYearVal, currentData]);

    const getPreviousValue = useCallback((name: string) => {
        const lastYear = (throttledYearVal - 1) + "";
        if (lastYear in currentData.dataset && name in currentData.dataset[lastYear]) {
            return currentData.dataset[lastYear][name];
        }
        return 0;
    }, [currentData, throttledYearVal]);

    const addAccessibleDescription = useCallback((e: ReactElement<ThreeElements['mesh']>) => {

        if (!e.props.name || !data.partLifetimeData[partType].hasPart(e.props.name)) {
            return e;
        }

        return <A11y
            role="content"
            key={e.props.name + partType.slice(0, -1)}
            description={makeBarLabel({
                partName: e.props.name,
                startYear: data.partLifetimeData[partType].firstYear(e.props.name),
                endYear: data.partLifetimeData[partType].lastYear(e.props.name),
                partType: partType,
                quantityFormat: quantityType,
                timeFormat: chronoType,
                currentValue: getCurrentValue(e.props.name),
                pastValue: getPreviousValue(e.props.name),
            })}

        >
            {e}
        </A11y>;

    }, [data, chronoType, getCurrentValue, getPreviousValue, partType, quantityType]);

    const colPointerOver = useCallback((e: ThreeEvent<PointerEvent>) => {
        if (data.partLifetimeData[partType].hasPart(e.object.name)) {
            setTooltipVisible(true);
            lastHoverRef.current = e.object.name;

            setTooltipContent(<TooltipContent
                partName={e.object.name}
                startYear={data.partLifetimeData[partType].firstYear(e.object.name)}
                endYear={data.partLifetimeData[partType].lastYear(e.object.name)}
                partType={partType}
                quantityFormat={quantityType}
                timeFormat={chronoType}
                currentValue={getCurrentValue(e.object.name)}
                pastValue={getPreviousValue(e.object.name)}
            ></TooltipContent>);
        }
        e.stopPropagation();
    }, [data, chronoType, getCurrentValue, getPreviousValue, partType, quantityType]);

    const colPointerOut = useCallback((e: ThreeEvent<PointerEvent>) => {
        if (lastHoverRef.current === e.object.name) {
            setTooltipVisible(false);
        }
        e.stopPropagation();
    }, []);

    function canvasPointerDown(e: React.PointerEvent<HTMLDivElement>) {
        if (e.pointerType === "mouse") {
            setMouseDown(true);
        }
    }

    function canvasPointerUp(e: React.PointerEvent<HTMLDivElement>) {
        if (e.pointerType === "mouse") {
            setMouseDown(false);
        }
    }

    function partTypeChange(s: string) {
        setPartType(s as PartType);
        setYearVal(Clamp(
            yearVal,
            data.histogramData[s as PartType][quantityType][chronoType].firstYear,
            data.histogramData[s as PartType][quantityType][chronoType].lastYear
        ));
    }

    const perspectiveCam = useRef(<PerspectiveCamera
        position={[0, 30, 7]}
        fov={75}
        makeDefault={true}>
    </PerspectiveCamera>);

    const orthographicCam = useRef(<OrthographicCamera
        position={[0, 9000, 0]}
        far={10000}
        zoom={Math.sqrt(Math.min(window.innerWidth, window.innerHeight) / 2) / 1.5}
        makeDefault={true}>
    </OrthographicCamera>);

    const barMat = useRef(new THREE.MeshStandardMaterial());

    return (<div role='none'>
        <div className="stats-canvas-parent" onPointerDown={e => canvasPointerDown(e)} onPointerUp={e => canvasPointerUp(e)} ref={canvasParentRef}>
            <StatsCanvas
                className="stats-canvas"
                rows={currentData.rows}
                cols={currentData.cols}
                cam={cameraType === "Perspective" ? perspectiveCam.current : orthographicCam.current}
                data={currentData.dataset[throttledYearVal]}
                xAxisLabel={"Stud Length"}
                yAxisLabel={"Stud Width"}
                headerLabel={GraphTitle(partType, quantityType, chronoType)}
                defaultHeight={defaultHeight}
                padding={padding}
                colWidth={colWidth}
                rowWidth={rowWidth}
                heightScaling={heightScaling}
                barMat={barMat.current}
                materialChange={materialChange}
                cameraControls={<CameraControls ref={camControlsRef} keyboardDOMCapture={canvasParentRef}></CameraControls>}
                colPointerOver={colPointerOver}
                colPointerOut={colPointerOut}
                imageAccessibilityLabel={"A 3D histogram for visualizing distributions of common LEGO parts over time. Accessible descriptions for relevant parts can be found in the elements below."}
                columnPostProcess={addAccessibleDescription}
            />
            <A11yAnnouncer />
        </div>

        <div className="year-controls">
            <label htmlFor="year-slider"><b>Year</b></label>

            <input className="year-slider" id="year-slider" type="range" min={currentData.firstYear} max={currentData.lastYear} onChange={sliderYearChange} value={yearVal}></input>

            <button className="year-button" aria-label="Decrease year" onClick={() => { buttonYearChange(-1); }}>{"<"}</button>
            <p aria-label="Current year">{yearVal}</p>
            <button className="year-button" aria-label="Increase year" onClick={() => { buttonYearChange(1); }}>{">"}</button>
        </div>

        <div className="dataset-selection-parent">
            <LabeledDropdown id={"parttypes"} label={"Part Types"} values={Object.values(PartType)} selected={partType} onChange={partTypeChange} />
            <LabeledDropdown id={"quantityformat"} label={"Quantity Format"} values={Object.values(QuantityType)} selected={quantityType} onChange={(s) => { setQuantityType(s as QuantityType); }} />
            <LabeledDropdown id={"timeformat"} label={"Time Format"} values={Object.values(ChronoType)} selected={chronoType} onChange={(s) => { setChronoType(s as ChronoType); }} />
        </div>

        <div className="scene-control-parent">
            <LabeledDropdown id={"verticalscaling"} label={"Vertical Scaling"} values={["Logarithmic", "Linear"]} selected={scalingType} onChange={setScalingType} />
            <LabeledDropdown id={"cameratype"} label={"Camera Type"} values={["Perspective", "Orthographic"]} selected={cameraType} onChange={setCameraType} />
            <button className="camera-button" onClick={buttonResetCamera}>{"Reset Camera"}</button>
        </div>

        {(tooltipVisible && !mouseDown) ? <MousePosTooltip className="tooltip" offsetX={tooltipArrowSize} offsetY={-tooltipArrowSize} content={
            tooltipContent
        }></MousePosTooltip> : null}

        <button onClick={() => { setAdvancedOptionsVisible(!advancedOptionsVisible); }} >
            {(advancedOptionsVisible) ? "Hide Advanced Options" : "Show Advanced Options"}
        </button>

        {(advancedOptionsVisible) ?
            (<div className="advanced-options">
                <div />
                <h3>Color Options</h3>
                <div className="advanced-options-row">
                    <LabeledColorPicker
                        id={"activebarcolor1"}
                        label={"Active Bar Color 1"}
                        value={barColor1}
                        onChange={setBarColor1}
                    ></LabeledColorPicker>
                    <LabeledColorPicker
                        id={"activebarcolor2"}
                        label={"Active Bar Color 2"}
                        value={barColor2}
                        onChange={setBarColor2}
                    ></LabeledColorPicker>
                    <LabeledColorPicker
                        id={"activebarcolor3"}
                        label={"Active Bar Color 3"}
                        value={barColor3}
                        onChange={setBarColor3}
                    ></LabeledColorPicker>
                </div>
                <div className="advanced-options-row">
                    <LabeledColorPicker
                        id={"emptybarcolor"}
                        label={"Empty Bar Color"}
                        value={emptyBarColor}
                        onChange={setEmptyBarColor}
                    ></LabeledColorPicker>
                    <LabeledColorPicker
                        id={"unusedbarcolor"}
                        label={"Unused Bar Color"}
                        value={unusedBarColor}
                        onChange={setUnusedBarColor}
                    ></LabeledColorPicker>
                    <LabeledColorPicker
                        id={"impossiblebarcolor"}
                        label={"Impossible Bar Color"}
                        value={impossibleBarColor}
                        onChange={setImpossibleBarColor}
                    ></LabeledColorPicker>
                </div>
                <div className="advanced-options-row">
                    <LabeledTextboxSlider
                        label={"Logarithmic Lerp Midpoint"}
                        value={logarithmicLerpMidpoint}
                        min={0}
                        max={1}
                        step={0.01}
                        onChange={setLogarithmicLerpMidpoint}
                    ></LabeledTextboxSlider>
                    <LabeledTextboxSlider
                        label={"Linear Lerp Midpoint"}
                        value={linearLerpMidpoint}
                        min={0}
                        max={1}
                        step={0.01}
                        onChange={setLinearLerpMidpoint}
                    ></LabeledTextboxSlider>
                </div>
                <div className="advanced-options-row">
                    <LabeledTextboxSlider
                        label={"Logarithmic Height Contribution Divisor"}
                        value={logColorHeightDiv}
                        min={1}
                        max={100}
                        onChange={setLogColorHeightDiv}
                    ></LabeledTextboxSlider>
                    <LabeledTextboxSlider
                        label={"Linear Height Contribution Divisor"}
                        value={linearColorHeightDiv}
                        min={1}
                        max={100}
                        onChange={setLinearColorHeightDiv}
                    ></LabeledTextboxSlider>
                </div>


                <h3>Geometry Options</h3>
                <div className="advanced-options-row">
                    <LabeledTextboxSlider
                        label={"Row Width"}
                        value={rowWidth}
                        min={0.25}
                        max={10}
                        step={0.25}
                        onChange={setColYWidth}
                    ></LabeledTextboxSlider>
                    <LabeledTextboxSlider
                        label={"Column Width"}
                        value={colWidth}
                        min={0.25}
                        max={10}
                        step={0.25}
                        onChange={setColXWidth}
                    ></LabeledTextboxSlider>
                </div>
                <div className="advanced-options-row">
                    <LabeledTextboxSlider
                        label={"Default Column Height"}
                        value={defaultHeight}
                        min={0}
                        max={5}
                        step={0.1}
                        onChange={setDefaultHeight}
                    ></LabeledTextboxSlider>
                    <LabeledTextboxSlider
                        label={"Padding"}
                        value={padding}
                        min={0}
                        max={10}
                        step={0.5}
                        onChange={setPadding}
                    ></LabeledTextboxSlider>
                </div>
            </div>)
            : null
        }


    </div>);
}

export default Histogram3DApp;
