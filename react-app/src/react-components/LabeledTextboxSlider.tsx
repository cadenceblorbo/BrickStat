import { Clamp } from "../utils/MathUtil.ts";
interface LabeledTextboxSliderProps {
    label: string;
    min: number;
    max: number;
    value: number;
    step?: number;
    onChange: (value: number) => void;
}

export default function LabeledTextboxSliderProps({
    label,
    min,
    max,
    value,
    step = 1,
    onChange
}: LabeledTextboxSliderProps) {

    const textboxChange = (e: string) => {
        const number = parseInt(e);
        if (isNaN(number)) {
            onChange(value);
        } else {
            onChange(Clamp(number, min, max));
        }
    };

    return <fieldset>
        <legend>{label}</legend>
        <input
            title={label + "text input (Enter a value between " + min + " and " + max + ".)"}
            type="text"
            value={value}
            onChange={e => textboxChange(e.target.value)}
        ></input>
        <input
            title={label + " slider"}
            type="range"
            value={value}
            min={min}
            max={max}
            step={step}
            onChange={e => onChange(Number(e.target.value))}
        ></input>

    </fieldset>;
}