import brickHistory from './dataset/brick-history.json'

class HistogramData {
	public dataset: { [key: string]: { [key: string]: number } };
	public xCols: number;
	public yCols: number;
	public firstYear: number;
	public lastYear: number;
	public isCumulative: boolean = false;
	constructor(
		rawJSON: { [key: string]: { [key: string]: number } }
	) {
		this.dataset = structuredClone(rawJSON);
		this.firstYear = Infinity;
		this.lastYear = -Infinity;
		this.xCols = 0;
		this.yCols = 0;
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

export function retrieveData(): HistogramData {
	return new HistogramData(brickHistory)
}