import redis from 'redis';
import { REDIS_HOST, REDIS_PORT, REDIS_DB } from './config.js';

//* Redis 연결
const redisClient = redis.createClient({
  url: `redis://@${REDIS_HOST}:${REDIS_PORT}/${REDIS_DB}`,
});
redisClient.on('connect', () => {
  console.info('Redis connected!');
});
redisClient.on('error', (err) => {
  console.error('Redis Client Error', err);
});

redisClient.connect().then();

export default redisClient;
