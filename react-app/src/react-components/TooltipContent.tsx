import { type TooltipContentProps } from '../interfaces/tooltip-content-props.ts';
import { DATA_LABELS } from '../utils/data-labels.ts';

const NUMBER_FORMAT = Intl.NumberFormat();

export default function TooltipContent({
    partName,
    startYear,
    endYear,
    partType,
    quantityFormat,
    timeFormat,
    currentValue,
    pastValue
}: TooltipContentProps) {
    const contents = [];

    //title
    let title = partName;
    title += " " + partType.toString().slice(0, -1);
    contents.push(<h3 key={0}>{title}</h3>);

    //data value
    const data = NUMBER_FORMAT.format(currentValue);
    let change = NUMBER_FORMAT.format(currentValue - pastValue);
    if (currentValue >= pastValue) {
        change = "+" + change;
    }
    contents.push(<p key={1}> {data + " " + DATA_LABELS[quantityFormat][timeFormat]} <i>{" (" + change + ")"}</i></p>);

    //chronology
    contents.push(<p key = { 2 }>{"First Appeared: " + startYear}<br></br>{"Last Appeared: " + endYear}</p>);

    return <div>
        {contents}
    </div>;
}