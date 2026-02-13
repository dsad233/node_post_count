import express from 'express';
import { connect } from './common/configs/mongodb.config.js';

import AuthRouter from './auth/auth.router.js';
import PostRouter from './posts/posts.router.js';
import UserRouter from './users/users.router.js';
import AdminRouter from './admin/admin.router.js';
import CronRouter from './cron/cron.router.js';

import { ErrorHandlerMiddleware } from './common/middlewares/error-exception.js';
import cookieParser from 'cookie-parser';
import morgan from './common/middlewares/morgan.js';
import cors from './common/middlewares/cors.js';
import { SIGNED_COOKIE_KEY } from './common/configs/config.js';

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(SIGNED_COOKIE_KEY));
app.use(cors);
connect();

app.use(morgan);
app.use('/auth', AuthRouter);
app.use('/posts', PostRouter);
app.use('/users', UserRouter);
app.use('/admin', AdminRouter);
app.use(CronRouter);

app.use(async (err, req, res, next) => {
  await ErrorHandlerMiddleware(err, req, res, next);
});

app.listen(port, () => {
  console.log(port, '로 서버 실행 중.');
});
