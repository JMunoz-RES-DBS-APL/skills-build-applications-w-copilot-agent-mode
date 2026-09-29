import express from 'express';
import db from './config/database.js';
const app = express();
const port = Number(process.env.PORT || 8000);
app.use(express.json());
app.get('/api/health', (_request, response) => {
    response.status(db.readyState === 1 ? 200 : 503).json({
        status: db.readyState === 1 ? 'ok' : 'connecting',
        database: 'octofit_db',
    });
});
app.listen(port, () => {
    console.log(`OctoFit API listening on port ${port}`);
});
