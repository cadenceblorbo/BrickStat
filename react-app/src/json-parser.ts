import brickSetHistory from './dataset/brick-set-history.json';
import brickTotalHistory from './dataset/brick-total-history.json';
import plateSetHistory from './dataset/plate-set-history.json';
import plateTotalHistory from './dataset/plate-total-history.json';
import tileSetHistory from './dataset/tile-set-history.json';
import tileTotalHistory from './dataset/tile-total-history.json';
import axleSetHistory from './dataset/axle-set-history.json';
import axleTotalHistory from './dataset/axle-total-history.json';

import { ChronoType, PartType, QuantityType } from './utils/lego-enum.ts';

const totalHistories: { [key in PartType]: { [key: string]: { [key: string]: number } } } = {
	[PartType.Bricks]: brickTotalHistory,
	[PartType.Plates]: plateTotalHistory,
	[PartType.Tiles]: tileTotalHistory,
	[PartType.Axles] : axleTotalHistory,
};

const setHistories: { [key in PartType]: { [key: string]: { [key: string]: number } } } = {
	[PartType.Bricks]: brickSetHistory,
	[PartType.Plates]: plateSetHistory,
	[PartType.Tiles]: tileSetHistory,
	[PartType.Axles]: axleSetHistory,
};

export class HistogramData {
	public dataset: { [key: string]: { [key: string]: number } };
	public rows: number;
	public cols: number;
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
		this.rows = 0;
		this.cols = 0;
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
				this.dataset[key][partType] += prev;
			} else {
				this.dataset[key][partType] = prev;
			}
		}
		
	}

	private computeYearBounds() {
		for (const year in this.dataset) {
			const numYear = Number(year);
			if (!isNaN(numYear)) {
				this.firstYear = Math.min(numYear, this.firstYear);
				this.lastYear = Math.max(numYear, this.lastYear);
			}
		}
	}

	private processNewPartType(encounteredParts: Set<string>, partType: string) {
		encounteredParts.add(partType);
		const splitParts = partType.split("x");
		if (splitParts.length >= 2) {
			this.rows = Math.max(this.rows, Number(splitParts[0]));
			this.cols = Math.max(this.cols, Number(splitParts[1]));
		}
	}
	
}

export class PartLifetimeData{
	private dataset: { [key: string]: [number, number] };
	constructor(rawJSON: { [key: string]: { [key: string]: number } }) {
		this.dataset = {};
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
		return part in this.dataset;
	}

	public firstYear(part: string): number {
		return this.dataset[part][0];
	}

	public lastYear(part: string): number {
		return this.dataset[part][1];
	}

}

export interface LegoDataset {
	histogramData: Record<PartType, Record<QuantityType, Record<ChronoType, HistogramData>>>,
	partLifetimeData: Record<PartType, PartLifetimeData>
}

export function retrieveData(): LegoDataset {

	const result = {
		histogramData: {},
		partLifetimeData: {}
	};

	for (const type in PartType) {
		Object.defineProperty(result.histogramData, type as PartType, {});
	}

	for (const [key, value] of Object.entries(totalHistories)){
		(result as LegoDataset).histogramData[key as PartType][QuantityType.TotalQuantity] = {
			[ChronoType.Cumulative]: new HistogramData(value, true),
			[ChronoType.ByYear]: new HistogramData(value)
		};
		Object.defineProperty(result.partLifetimeData, key as PartType, new PartLifetimeData(value));
	}

	for (const [key, value] of Object.entries(setHistories)) {
		(result as LegoDataset).histogramData[key as PartType][QuantityType.SetApperances] = {
			[ChronoType.Cumulative]: new HistogramData(value, true),
			[ChronoType.ByYear]: new HistogramData(value)
		};
	}

	return result as LegoDataset;
}