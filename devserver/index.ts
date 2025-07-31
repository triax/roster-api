import express from 'express';
import { importSourceFiles } from './import';

importSourceFiles();

const app = express();
const PORT = process.env.PORT || 3000;

// This endpoint imitates the web endpoint of GAS
// https://script.google.com/macros/s/{{deploymentId}}/exec
app.get('/exec', (req, res) => {
    try {
        const action = req.query.action as string || 'members';
        const params = req.query as Record<string, any>;
        const result = (global as any).routes(action, params);
        // Handle HtmlOutput or TextOutput response
        if (result && typeof result.getContent === 'function') {
            const content = result.getContent();
            const mimeType = result.getMimeType ? result.getMimeType() : 'text/html';
            res.setHeader('Content-Type', mimeType);
            res.send(content);
        } else if (result && typeof result === 'object') {
            // Handle plain object response
            res.json(result);
        } else {
            res.send(result);
        }
    } catch (error) {
        console.error('Error in /exec endpoint:', error);
        res.status(500).json({ 
            error: 'Internal server error', 
            message: error instanceof Error ? error.message : 'Unknown error' 
        });
    }
});

app.listen(PORT, () => {
    console.log(`Development server running at http://localhost:${PORT}`);
    console.log(`GAS endpoint: http://localhost:${PORT}/exec`);
});
