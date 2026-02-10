import brickTotalHistory from './dataset/brick-total-history.json'
import brickSetHistory from './dataset/brick-set-history.json'
import { PartType, QuantityType, ChronoType } from './utils/lego-enum.ts';

export class HistogramData {
	public dataset: { [key: string]: { [key: string]: number } };
	public xCols: number;
	public yCols: number;
	public firstYear: number;
	public lastYear: number;
	public isCumulative: boolean = false;
	constructor(
		rawJSON: { [key: string]: { [key: string]: number } },
		isCumulative: boolean = false
	) {
		this.dataset = structuredClone(rawJSON);
		this.firstYear = Infinity;
		this.lastYear = -Infinity;
		this.xCols = 0;
		this.yCols = 0;
		this.isCumulative = isCumulative;
		this.computeYearBounds();

		const encounteredParts = new Set<string>();
		for (const partType in this.dataset[this.firstYear + ""]) {
			this.processNewPartType(encounteredParts, partType);
		}
		for (let i: number = this.firstYear + 1; i <= this.lastYear; i++) {
			const key = i + "";
			//add empty dataset if year absent
			if (!(key in this.dataset)) {
				this.dataset[key] = {};
			}
			if (this.isCumulative) {
				this.formatCumulativeData(key, encounteredParts, i);
			}
			//add new parts to encountered list
			for (const currentPartType in this.dataset[key]) {
				if (!encounteredParts.has(currentPartType)) {
					this.processNewPartType(encounteredParts, currentPartType);
				}
			}
		}
	}

	private formatCumulativeData(key: string, encounteredParts: Set<string>, i: number) {
		//correct values for previously encountered parts
		for (const partType of encounteredParts) {
			const prev = this.dataset[(i - 1) + ""][partType];
			if (partType in this.dataset[key]) {
				this.dataset[key][partType] += prev
			} else {
				this.dataset[key][partType] = prev
			}
		}
		
	}

	private computeYearBounds() {
		for (const year in this.dataset) {
			const numYear = Number(year)
			if (!isNaN(numYear)) {
				this.firstYear = Math.min(numYear, this.firstYear)
				this.lastYear = Math.max(numYear, this.lastYear)
			}
		}
	}

	private processNewPartType(encounteredParts: Set<string>, partType: string) {
		encounteredParts.add(partType);
		const splitParts = partType.split("x");
		if (splitParts.length >= 2) {
			this.xCols = Math.max(this.xCols, Number(splitParts[0]));
			this.yCols = Math.max(this.yCols, Number(splitParts[1]));
		}
	}
	
}

export class PartLifetimeData{
	private dataset: {[key: string] : [number, number]}
	constructor(rawJSON: { [key: string]: { [key: string]: number } }) {
		this.dataset = {}
		this.computeLifetimes(rawJSON);
	}

	private computeLifetimes(rawJSON: { [key: string]: { [key: string]: number } }) {
		for (const year in rawJSON) {
			const numYear = Number(year);
			for (const part in rawJSON[year]) {
				if (part in this.dataset) {
					this.dataset[part][0] = Math.min(numYear, this.dataset[part][0]);
					this.dataset[part][1] = Math.max(numYear, this.dataset[part][1]);
				} else {
					this.dataset[part] = [numYear, numYear];
				}
			}
		}
	}

	public hasPart(part: string): boolean {
		return part in this.dataset
	}

	public firstYear(part: string): number {
		return this.dataset[part][0];
	}

	public lastYear(part: string): number {
		return this.dataset[part][1];
	}

}

export interface LegoDataset {
	histogramData: { [key in PartType]: { [key in QuantityType]: { [key in ChronoType]: HistogramData } } },
	partLifetimeData: {[key in PartType]: PartLifetimeData}

}

export function retrieveData(): LegoDataset {
	return {
		histogramData: {
			[PartType.Bricks]: {
				[QuantityType.TotalQuantity]: {
					[ChronoType.Cumulative]: new HistogramData(brickTotalHistory, true),
					[ChronoType.ByYear]: new HistogramData(brickTotalHistory)
				},
				[QuantityType.SetApperances]: {
					[ChronoType.Cumulative]: new HistogramData(brickSetHistory, true),
					[ChronoType.ByYear]: new HistogramData(brickSetHistory)
				}
			}
		},
		partLifetimeData: {
			[PartType.Bricks] : new PartLifetimeData(brickTotalHistory)
		}
		
	}
		
		
	
}