import express, { Request , Response } from 'express';
import client from 'prom-client';

const collectDefaultMetrics = client.collectDefaultMetrics;
const Registry = client.Registry;
const register = new Registry();
collectDefaultMetrics({ register });

const router = express.Router();

router.get('/metrics', async (req : Request , res : Response) => {
    try {
		res.set('Content-Type', register.contentType);
		res.end(await register.metrics());
	} catch (err) {
		res.status(500).end(err);
	}
});

export { router as metricsRouter }