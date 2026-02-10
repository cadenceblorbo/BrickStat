import { ChronoType, PartType, QuantityType } from '../utils/lego-enum.ts';

const NUMBER_FORMAT = Intl.NumberFormat();

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
    const contents = []

    //title
    let title = partName;
    switch (partType) {
        case PartType.Bricks:
            title += "Brick"
            break;
        default:
            break;
    }
    contents.push(<p>{title}</p>);

    //data value
    let data = NUMBER_FORMAT.format(currentValue);

    //chronology
    contents.push(<p>{"First Appeared: " + startYear}</p>);
    contents.push(<p>{"Last Appeared: " + endYear}</p>);

    return <div>
        {contents}
    </div>;
}