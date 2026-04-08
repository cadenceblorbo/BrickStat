export const PartType = {
	Bricks: "Bricks",
	Plates: "Plates",
	Tiles: "Tiles",
	Axles: "Axles"
} as const;

export type PartType = (typeof PartType)[keyof typeof PartType];

export const ChronoType = {
	Cumulative: "Cumulative",
	ByYear: "By Year"
} as const;

export type ChronoType = (typeof ChronoType)[keyof typeof ChronoType];

export const QuantityType = {
	TotalQuantity: "Total Quantity",
	SetApperances: "Set Apperances"
} as const;

export type QuantityType = (typeof QuantityType)[keyof typeof QuantityType];