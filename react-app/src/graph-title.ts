const titleMap = new Map([
    ["Bricks Total Quantity Cumulative", "Cumulative Total Brick Quantities by Size"],
    ["Bricks Set Apperances Cumulative", "Cumulative Brick Set Apperances by Size"],
    ["Bricks Total Quantity By Year", "Yearly Total Brick Quantities by Size"],
    ["Bricks Set Apperances By Year", "Yearly Brick Set Apperances by Size"],
])

export function GraphTitle(partType: string, quantityType: string, chronoType: string): string {
    const comb = partType + " " + quantityType + " " + chronoType;
    if (titleMap.has(comb)){
        return (titleMap.get(comb));
    } else {
        return ("Default Title");
    }
}
