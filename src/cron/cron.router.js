import express from 'express';
import cron from 'node-cron';

import { CronController } from './cron.controller.js';
import { CronService } from './cron.service.js';

const router = express.Router();

const cronService = new CronService();
const cronController = new CronController(cronService);

cron.schedule('30 * * * * *', cronController.updateViews);
// 1분 마다 실행
cron.schedule('*/1 * * * *', cronController.getViews);

export default router;
