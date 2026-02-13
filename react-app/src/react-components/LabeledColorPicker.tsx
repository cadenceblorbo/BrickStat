interface LabeledColorPickerProps{
    label: string;
    value: string;
    onChange: (value: string) => void;
}

export default function LabeledColorPicker({
    label,
    value,
    onChange

}: LabeledColorPickerProps) {
    return(
        <label>
            {label}
            <input
                type="color"
                value={value}
                onChange={e => onChange(e.target.value)}
            ></input>
        </label>);
}