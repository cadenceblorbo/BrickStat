
interface LabeledDropdownProps {
    id: string;
    label: string;
    values: string[];
    selected: string;
    onChange: (value: string) => void;
}

export default function LabeledDropdown({
    id,
    label,
    values,
    selected,
    onChange
}: LabeledDropdownProps) {
    let i = 0;
    const dropdownOptions = [];
    for (const value of values) {
        dropdownOptions.push(<option
            key={i}
            value={value}
        >
            {value}
        </option>);
        i++;
    }

    return(
        <label htmlFor={id}>
            {label}
            <select
                id={id}
                value={selected}
                onChange={e => onChange(e.target.value)}
            >
                {...dropdownOptions}
            </select>
        </label>);
}