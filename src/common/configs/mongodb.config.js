import mongoose from 'mongoose';
import {
  NODE_ENV,
  MONGODB_ID,
  MONGODB_PASS,
  MONGODB_APP_NAME,
  MONGODB_NAME,
} from './config.js';
import { v4 } from 'uuid';

const dbUrl = `mongodb+srv://${MONGODB_ID}:${MONGODB_PASS}@cluster0.bzb3xmb.mongodb.net/?retryWrites=true&w=majority&appName=${MONGODB_APP_NAME}`;
// const dbUrl = 'mongodb://root:root@localhost:27017/test_db?authSource=admin';

export const connect = () => {
  if (NODE_ENV !== 'production') {
    mongoose.set('debug', true); //디버그 모드 true.
  }

  mongoose
    .connect(dbUrl, {
      pkFactory: { createPk: () => v4() },
      dbName: MONGODB_NAME,
    })
    .then(() => console.log('몽고 디비 Connection Done.'))
    .catch((err) => console.error('디비 연결 Error: ', err));
};

mongoose.connection.on('error', (error) => {
  console.error('몽고디비 연결 에러', error);
});

mongoose.connection.on('disconnected', () => {
  console.error('연결 재시도 중...');
  connect();
});
