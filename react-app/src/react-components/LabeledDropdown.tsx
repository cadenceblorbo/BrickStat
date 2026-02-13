
interface LabeledDropdownProps {
    label: string;
    values: string[];
    selected: string;
    onChange: (value: string) => void;
}

export default function LabeledDropdown({
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

    return <div>
        <label>
            {label}
            <select
                value={selected}
                onChange={e => onChange(e.target.value)}
            >
                {...dropdownOptions}
            </select>
        </label>

    </div>;
}