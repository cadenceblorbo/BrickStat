import { useState, useRef, type RefObject } from 'react';
import { stylesHiddenButScreenreadable } from '../a11y/A11yConsts.tsx';

import { Clamp } from "../utils/MathUtil.ts";

interface LabeledTextboxSliderProps {
    label: string;
    min: number;
    max: number;
    value: number;
    step?: number;
    onChange: (value: number) => void;
}

const hiddenLabelStyle = { clip: "rect(0 0 0 0)", margin: "-1px", overflow: "hidden", width: "1px", height: "1px" };

export default function LabeledTextboxSliderProps({
    label,
    min,
    max,
    value,
    step = 1,
    onChange
}: LabeledTextboxSliderProps) {

    const [textValue, setTextValue] = useState(value + "");
    const textInputRef: RefObject<HTMLInputElement> = useRef(null!);

    const textboxEnter = (e: string) => {
        const number = parseFloat(e);
        if (isNaN(number)) {
            onChange(value);
        } else {
            const next = Clamp(number, min, max);
            onChange(next);
            setTextValue(next+"");
        }
    };

    const onSliderChange = (e: string) => {
        onChange(Number(e));
        setTextValue(e);
    };

    const handleEnter = (key: string) => {
        if (key === 'Enter' && textInputRef.current) {
            textInputRef.current.blur();
        }
    };

    return <fieldset>
        <legend>{label}</legend>
        <label
            htmlFor={label + " text input"}
            style={hiddenLabelStyle }
        >{label + " text input (Enter a value between " + min + " and " + max + ".)"}</label>
        <input
            id={label + " text input"}
            ref={textInputRef}
            type="text"
            value={textValue}
            onChange={e => setTextValue(e.target.value)}
            onBlur={e => textboxEnter(e.target.value)}
            onKeyDown={e =>  handleEnter(e.key)}
        ></input>
        <label
            htmlFor={label + " slider"}
            style={hiddenLabelStyle}
        >{label + " slider"}</label>
        <input
            id={label + " slider"}
            type="range"
            value={value}
            min={min}
            max={max}
            step={step}
            onChange={e => onSliderChange(e.target.value)}
        ></input>

    </fieldset>;
}