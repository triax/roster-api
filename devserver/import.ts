import * as fs from 'fs';
import * as path from 'path';
import * as vm from 'vm';
import * as ts from 'typescript';
import { SpreadsheetApp } from './spreadsheet';

// {{{ Import everything under ../src as global variables
// We need some tweeking to make this work because
// in GAS runtime, everthing is global and import/export is not used.
// Let's make everything under ../src referrable as global variables.
export function importSourceFiles() {
    // Create a context with necessary globals
    const context = vm.createContext({
        console,
        process,
        Buffer,
        require,
        __dirname,
        __filename,
        setTimeout,
        setInterval,
        clearTimeout,
        clearInterval,
        // GAS globals
        SpreadsheetApp,
        ContentService: {
            createTextOutput: (content: string) => ({
                setMimeType: (mimeType: string) => ({
                    getContent: () => content,
                    getMimeType: () => mimeType
                })
            }),
            MimeType: {
                JSON: 'application/json'
            }
        }
    });

    // Load TypeScript files from src directory
    const srcPath = path.join(__dirname, '../src');
    
    try {
        const files = fs.readdirSync(srcPath)
            .filter(f => f.endsWith('.ts') && f !== 'appsscript.json')
            .filter(f => f !== 'main.ts') // Only main.ts uses GAS variables
            .sort(); // Ensure consistent loading order

        files.forEach(file => {
            const filePath = path.join(srcPath, file);
            const tsCode = fs.readFileSync(filePath, 'utf-8');
            
            // Transpile TypeScript to JavaScript
            const result = ts.transpileModule(tsCode, {
                compilerOptions: {
                    module: ts.ModuleKind.None,
                    target: ts.ScriptTarget.ES2019,
                    lib: ['es2019'],
                    removeComments: false,
                    esModuleInterop: true,
                    skipLibCheck: true
                }
            });
            
            // Remove export statements and module.exports
            const cleanedCode = result.outputText
                .replace(/export\s+{[^}]*};?\s*$/gm, '')
                .replace(/export\s+default\s+/g, '')
                .replace(/export\s+/g, '')
                .replace(/module\.exports\s*=\s*/g, '')
                .replace(/exports\./g, 'global.');
            
            try {
                vm.runInContext(cleanedCode, context);
                console.log(`Loaded: ${file}`);
            } catch (error) {
                console.error(`Error loading ${file}:`, error);
            }
        });

        // Transfer all properties from context to global
        Object.keys(context).forEach(key => {
            if (!['console', 'process', 'Buffer', 'require', '__dirname', '__filename', 
                 'setTimeout', 'setInterval', 'clearTimeout', 'clearInterval'].includes(key)) {
                (global as any)[key] = context[key];
            }
        });

        console.log('All GAS globals loaded successfully');
    } catch (error) {
        console.error('Error loading GAS globals:', error);
    }
}
