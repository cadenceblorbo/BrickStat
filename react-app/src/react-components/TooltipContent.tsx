import { ChronoType, QuantityType } from '../utils/lego-enum.ts';

export interface TooltipContentProps {
    partName: string,
    startYear: number,
    endYear: number,
    quantityFormat: QuantityType,
    timeFormat: ChronoType,
    currentValue: number,
    pastValue: number
}