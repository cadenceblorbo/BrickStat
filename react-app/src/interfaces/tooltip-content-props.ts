import { ChronoType, PartType, QuantityType } from '../utils/lego-enum.ts';

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