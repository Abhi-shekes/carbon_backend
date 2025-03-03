// routes/newsRoutes.js

import express from 'express';
import { fetchEnvironmentalNews } from '../controllers/newsController.js';

const router = express.Router();

// Define the route to fetch environmental news
router.post('/news', fetchEnvironmentalNews);

export default router;
