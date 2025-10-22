import express from 'express';
import cron from 'node-cron';

import { CronController } from './cron.controller.js';
import { CronService } from './cron.service.js';

import { AsyncWrapper } from '../common/middlewares/async.js';

const router = express.Router();

const cronService = new CronService();
const cronController = new CronController(cronService);

cron.schedule('30 * * * * *', AsyncWrapper(cronController.updateViews));
// 1분 마다 실행
cron.schedule('*/1 * * * *', AsyncWrapper(cronController.getViews));

export default router;
