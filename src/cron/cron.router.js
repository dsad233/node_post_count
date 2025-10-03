import express from 'express';
import cron from 'node-cron';

import { CronController } from './cron.controller.js';
import { CronService } from './cron.service.js';

const router = express.Router();

const cronService = new CronService();
const cronController = new CronController(cronService);

cron.schedule('5 * * * * *', cronController.updateViews);
cron.schedule('8 * * * * *', cronController.getViews);

export default router;
