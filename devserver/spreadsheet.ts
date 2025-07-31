import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse/sync';

// Read CSV under ../data/*.csv
function readCSV(filePath: string): string[][] {
    const raw = fs.readFileSync(filePath, 'utf-8');
    const records = parse(raw, {
        delimiter: ',',
        columns: false,
        trim: true,
        skip_empty_lines: true,
        relax_column_count: true
    });
    return records;
}

function getCSVData(): string[][] {
    // Find csv file under ../data/
    const dataDir = path.join(__dirname, '../data');
    
    // Check if data directory exists
    if (!fs.existsSync(dataDir)) {
        throw new Error('Data directory does not exist: ' + dataDir);
    }
    
    const files = fs.readdirSync(dataDir).filter(file => file.endsWith('.csv'));
    if (files.length === 0) {
        throw new Error('No CSV files found in data directory');
    }
    const filePath = path.join(dataDir, files[0]);
    console.log('Loading CSV from:', filePath);
    return readCSV(filePath);
}

export const SpreadsheetApp = {
    getActiveSheet: () => {
        return {
            getDataRange: () => {
                return {
                    getValues: () => {
                        // Return CSV data as 2D array
                        return getCSVData();
                    }
                };
            }
        };
    }
}