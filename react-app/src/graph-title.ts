import { ChronoType, PartType, QuantityType } from './utils/lego-enum.ts';

export function GraphTitle(partType: PartType, quantityType: QuantityType, chronoType: ChronoType): string {
    let result = "";

    switch (partType) {
        case PartType.Bricks:
            result = "Brick";
            break;
        case PartType.Plates:
            result = "Plate";
            break;
        case PartType.Tiles:
            result = "Tile";
            break;
        default:
            result = "Default Part";
            break;
    }

    switch (quantityType) {
        case QuantityType.SetApperances:
            result += " Set Apperances";
            break;
        case QuantityType.TotalQuantity:
            result = "Total " + result + " Quantities";
            break;
        default:
            result += " Default Quantity Type";
            break;
    }

    switch (chronoType) {
        case ChronoType.ByYear:
            result = "Yearly " + result;
            break;
        case ChronoType.Cumulative:
            result = "Cumulative " + result;
            break;
        default:
            result = "Default Time Format " + result;
            break;
    }

    return result + " by Size";
}
