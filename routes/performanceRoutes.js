// routes/performanceRoutes.js

import express from 'express';
import { analyzePerformance } from '../controllers/performanceController.js';

const router = express.Router();

// Define the route to analyze website performance
router.post('/analyze', analyzePerformance);

export default router;
