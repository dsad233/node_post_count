import express from 'express';
import { connect } from './src/common/configs/mongodb.config.js';

import AuthRouter from './src/auth/auth.router.js';
import PostRouter from './src/posts/posts.router.js';
import UserRouter from './src/users/users.router.js';
import AdminRouter from './src/admin/admin.router.js';
import CronRouter from './src/cron/cron.router.js';

import { ErrorHandlerMiddleware } from './src/common/middlewares/error-exception.js';
import cookieParser from 'cookie-parser';
import morgan from './src/common/middlewares/morgan.js';
import cors from './src/common/middlewares/cors.js';
import { SIGNED_COOKIE_KEY } from './src/common/configs/config.js';

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

app.use((err, req, res, next) => {
  ErrorHandlerMiddleware(err, req, res, next);
});

app.listen(port, () => {
  console.log(port, '로 서버 실행 중.');
});

export default app;
