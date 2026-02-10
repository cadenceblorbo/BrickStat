import { ChronoType, PartType, QuantityType } from '../utils/lego-enum.ts';

const NUMBER_FORMAT = Intl.NumberFormat();

const DATA_LABELS = {
    [QuantityType.TotalQuantity]: {
        [ChronoType.ByYear]: "total apperances this year",
        [ChronoType.Cumulative]: "cumulative total apperances"
    },
    [QuantityType.SetApperances]: {
        [ChronoType.ByYear]: "set apperances this year",
        [ChronoType.Cumulative]: "cumulative set apperances"
    }
};

export interface TooltipContentProps {
    partName: string,
    startYear: number,
    endYear: number,
    partType: PartType,
    quantityFormat: QuantityType,
    timeFormat: ChronoType,
    currentValue: number,
    pastValue: number
}

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
    switch (partType) {
        case PartType.Bricks:
            title += " Brick";
            break;
        default:
            break;
    }
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