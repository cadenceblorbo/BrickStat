interface LabeledColorPickerProps{
    id: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
}

export default function LabeledColorPicker({
    id,
    label,
    value,
    onChange

}: LabeledColorPickerProps) {
    return(
        <label htmlFor={id}>
            {label}
            <input
                id={id}
                type="color"
                value={value}
                onChange={e => onChange(e.target.value)}
            ></input>
        </label>);
}