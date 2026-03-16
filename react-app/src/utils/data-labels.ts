import { ChronoType, QuantityType } from '../utils/lego-enum.ts';

export const DATA_LABELS = {
    [QuantityType.TotalQuantity]: {
        [ChronoType.ByYear]: "total apperances this year",
        [ChronoType.Cumulative]: "cumulative total apperances"
    },
    [QuantityType.SetApperances]: {
        [ChronoType.ByYear]: "set apperances this year",
        [ChronoType.Cumulative]: "cumulative set apperances"
    }
};