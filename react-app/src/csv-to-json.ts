import * as fs from 'fs';
import * as csvPromise from './csv-promise.ts';
import * as partNumbers from './part-numbers/index.ts';

//last data: feb 23 2026

const setsPath = "./dataset/sets.csv";
const inventoriesPath = "./dataset/inventories.csv";
const inventoryPartsPath = "./dataset/inventory_parts.csv";

const brickTotalOutputPath = "./dataset/brick-total-history.json";
const brickSetOutputPath = "./dataset/brick-set-history.json";
const plateTotalOutputPath = "./dataset/plate-total-history.json";
const plateSetOutputPath = "./dataset/plate-set-history.json";
const tileTotalOutputPath = "./dataset/tile-total-history.json";
const tileSetOutputPath = "./dataset/tile-set-history.json";
const axleTotalOutputPath = "./dataset/axle-total-history.json";
const axleSetOutputPath = "./dataset/axle-set-history.json";

type InventoriesData = {
    id: string;
    version: string;
    set_num: string;
}

type SetsData = {
    set_num: string;
    name: string;
    year: string;
    theme_id: string;
    num_parts: string;
    img_url: string;
}

type InventoryPartsData = {
    inventory_id: string;
    part_num: string;
    color_id: string;
    quantity: string;
    is_spare: string;
    img_url: string;
}

async function getIDToYearMapping(): Promise<Map<string, string>> {
    const setNumToYear = new Map<string, string>();

    const onSetData = (row: SetsData) => {
        setNumToYear.set(row.set_num, row.year);
    };

    await csvPromise.parseCSV<SetsData>(setsPath, onSetData);

    const invIDToYear = new Map<string, string>();

    const onInventoriesData = (row: InventoriesData) => {
        if (row.version !== "1") {
            return;
        }
        const year: string | undefined = setNumToYear.get(row.set_num);
        
        if (year !== undefined) {
            invIDToYear.set(row.id, year);
        }
    };

    await csvPromise.parseCSV<InventoriesData>(inventoriesPath, onInventoriesData);

    return new Promise<Map<string, string>>((resolve) => { resolve(invIDToYear); });
}

function getTrimmedPartNumber(fullID: string): string {
    //cut off all string after first num->char transition
    let index: number = 0;
    while (index < fullID.length) {
        if (!isNaN(Number(fullID[index]))) {
            break;
        }
        index++;
    }
    while (index < fullID.length) {
        if (isNaN(Number(fullID[index]))) {
            break;
        }
        index++;
    }
    return fullID.substring(0, index);
}

async function getPartDataByYear(partsMap: Map<string, string>, useQuantity: boolean = true): Promise<Map<number, Map<string, number>>> {
    const idToYear = await getIDToYearMapping();
    
    const partDataByYear: Map<number, Map<string, number>> = new Map();

    let skipID = "";
    const skipSet = new Set();

    const onInventoryPartsData = (row: InventoryPartsData) => {
        if (skipID !== row.inventory_id) {
            skipID = "";
            skipSet.clear();
        }

        const trimmedNumber = getTrimmedPartNumber(row.part_num);

        const dims: string | undefined = partsMap.get(trimmedNumber);

        if (skipSet.has(dims)) {
            return;
        }

        const year: number = Number(idToYear.get(row.inventory_id));

        if (dims === undefined || isNaN(year) || row.is_spare == "True") {
            return;
        }
        if (!partDataByYear.has(year)) {
            partDataByYear.set(year, new Map());
        }
        const currentPartMap = partDataByYear.get(year);
        if (currentPartMap !== undefined) {
            if (useQuantity) {
                currentPartMap.set(dims, (currentPartMap.get(dims) ?? 0) + Number(row.quantity));
            } else {
                currentPartMap.set(dims, (currentPartMap.get(dims) ?? 0) + 1);
                skipID = row.inventory_id;
                skipSet.add(dims);
                
            }

        }
    };

    await csvPromise.parseCSV(inventoryPartsPath, onInventoryPartsData);
    
    return new Promise((resolve) => { resolve(partDataByYear); } );
}

async function regenerateFiles() {
    const totalBrickData = await getPartDataByYear(partNumbers.brickMap, true);
    const setBrickData = await getPartDataByYear(partNumbers.brickMap, false);
    const totalPlateData = await getPartDataByYear(partNumbers.plateMap, true);
    const setPlateData = await getPartDataByYear(partNumbers.plateMap, false);
    const totalTileData = await getPartDataByYear(partNumbers.tileMap, true);
    const setTileData = await getPartDataByYear(partNumbers.tileMap, false);
    const totalAxleData = await getPartDataByYear(partNumbers.axleMap, true);
    const setAxleData = await getPartDataByYear(partNumbers.axleMap, false);

    const replacer = (key: unknown, value: unknown) => {
        if (value instanceof Map) {
            return Object.fromEntries(value);
        }
        return value;
    };

    fs.writeFileSync(brickTotalOutputPath, JSON.stringify(totalBrickData, replacer, 4));
    fs.writeFileSync(brickSetOutputPath, JSON.stringify(setBrickData, replacer, 4));
    fs.writeFileSync(plateTotalOutputPath, JSON.stringify(totalPlateData, replacer, 4));
    fs.writeFileSync(plateSetOutputPath, JSON.stringify(setPlateData, replacer, 4));
    fs.writeFileSync(tileTotalOutputPath, JSON.stringify(totalTileData, replacer, 4));
    fs.writeFileSync(tileSetOutputPath, JSON.stringify(setTileData, replacer, 4));
    fs.writeFileSync(axleTotalOutputPath, JSON.stringify(totalAxleData, replacer, 4));
    fs.writeFileSync(axleSetOutputPath, JSON.stringify(setAxleData, replacer, 4));


}

regenerateFiles();