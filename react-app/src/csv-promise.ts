import csvParser from 'csv-parser';
import fs from 'fs';

export async function parseCSV<T>(path: string, onData: (row: T) => void): Promise<void> {
    console.log("Started parsing CSV at " + path)

    return new Promise<void>(function (resolve, reject) {
        fs.createReadStream(path)
            .pipe(csvParser())
            .on('data', (row: T) => {
                onData(row);
            })
            .on('end', () => {
                console.log("Parsed data from path " + path + "!");
                resolve();
            })
            .on('error', (error: Error) => {
                reject("Error when reading data: " + error.message);
            });
    });
    
}