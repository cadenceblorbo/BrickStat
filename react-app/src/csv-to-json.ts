import * as fs from 'fs';
import * as partNumbers from './part-numbers/index.ts'
import * as csvPromise from './csv-promise.ts'

//last data: sept 23 2025

const setsPath = "./dataset/sets.csv"
const inventoriesPath = "./dataset/inventories.csv"
const inventoryPartsPath = "./dataset/inventory_parts.csv"

const brickOutputPath = "./dataset/brick-history.json"

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
    }

    await csvPromise.parseCSV<SetsData>(setsPath, onSetData);

    const invIDToYear = new Map<string, string>();

    const onInventoriesData = (row: InventoriesData) => {
        if (row.version !== "1") {
            return;
        }
        const year: string | undefined = setNumToYear.get(row.set_num)
        
        if (year !== undefined) {
            invIDToYear.set(row.id, year);
        }
    };

    await csvPromise.parseCSV<InventoriesData>(inventoriesPath, onInventoriesData);

    return new Promise<Map<string, string>>((resolve) => { resolve(invIDToYear) });
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

async function getPartDataByYear(): Promise<Map<number, Map<string, number>>> {
    const idToYear = await getIDToYearMapping();
    
    const partDataByYear: Map<number, Map<string, number>> = new Map();

    const onInventoryPartsData = (row: InventoryPartsData) => {
        const trimmedNumber = getTrimmedPartNumber(row.part_num);

        const dims: string | undefined = partNumbers.brickMap.get(trimmedNumber);
        const year: number = Number(idToYear.get(row.inventory_id));
        if (dims === undefined || isNaN(year) || row.is_spare == "True") {
            return;
        }
        if (!partDataByYear.has(year)) {
            partDataByYear.set(year, new Map());
        }
        const currentPartMap = partDataByYear.get(year);
        if (currentPartMap !== undefined) {
            currentPartMap.set(dims, (currentPartMap.get(dims) ?? 0) + Number(row.quantity));
        }
    }

    await csvPromise.parseCSV(inventoryPartsPath, onInventoryPartsData);
    
    return new Promise((resolve) => { resolve(partDataByYear); } );
}

async function regenerateFiles() {
    const partDataByYear = await getPartDataByYear();

    const replacer = (key: unknown, value: unknown) => {
        if (value instanceof Map) {
            return Object.fromEntries(value);
        }
        return value
    }
    //console.log(JSON.stringify(partDataByYear, replacer))

    fs.writeFileSync(brickOutputPath, JSON.stringify(partDataByYear, replacer, 4))
}

regenerateFiles();