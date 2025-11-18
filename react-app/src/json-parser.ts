import brickHistory from './dataset/brick-history.json'

class HistogramData {
	public byYear: { [key: string]: { [key: string]: number } };
	public cumulative: { [key: string]: { [key: string]: number } };
	public xCols: number;
	public yCols: number;
	public firstYear: number;
	public lastYear: number;
	constructor(
		rawJSON: { [key: string]: { [key: string]: number } }
	) {
		this.byYear = structuredClone(rawJSON);
		this.cumulative = structuredClone(rawJSON);
		this.firstYear = Infinity;
		this.lastYear = -Infinity;
		this.xCols = 0;
		this.yCols = 0;
		this.computeYearBounds();
		
		const encounteredParts = new Set<string>();
		for (const partType in this.cumulative[this.firstYear + ""]) {
			this.processNewPartType(encounteredParts, partType);
		}
		for (let i: number = this.firstYear + 1; i <= this.lastYear; i++) {
			const key = i + "";
			//add empty dataset if year absent
			if (!(key in this.cumulative)) {
				this.cumulative[key] = {};
				this.byYear[key] = {}
			}
			//correct values for previously encountered parts
			for (const partType of encounteredParts) {
				const prev = this.cumulative[(i - 1) + ""][partType];
				if (partType in this.cumulative[key]) {
					this.cumulative[key][partType] += prev
				} else {
					this.cumulative[key][partType] = prev
				}
			}
			//add new parts to encountered list
			for (const currentPartType in this.cumulative[key]) {
				if (!encounteredParts.has(currentPartType)) {
					this.processNewPartType(encounteredParts, currentPartType);
				}
			}
		}


	}

	private computeYearBounds() {
		for (const year in this.cumulative) {
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

export function retrieveData(): HistogramData {
	return new HistogramData(brickHistory)
}