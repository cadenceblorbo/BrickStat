import { DATA_LABELS } from './data-labels.ts';
import { type TooltipContentProps } from '../interfaces/tooltip-content-props.ts';

const NUMBER_FORMAT = Intl.NumberFormat();

export default function makeBarLabel({
    partName,
    startYear,
    endYear,
    partType,
    quantityFormat,
    timeFormat,
    currentValue,
    pastValue
}: TooltipContentProps) {

    let change = NUMBER_FORMAT.format(currentValue - pastValue);
    if (currentValue >= pastValue) {
        change = "+" + change;
    }

    return partName +
        " " +
        partType.slice(0, -1) +
        ". " +
        currentValue +
        " " +
        DATA_LABELS[quantityFormat][timeFormat] +
        " (" +
        change +
        " from last year). First appeared in " +
        startYear +
        ". Last appeared in " +
        endYear +
        ".";
}