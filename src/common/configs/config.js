import dotenv from 'dotenv';
dotenv.config();

/**
 * Default
 */
export const NODE_ENV = process.env.NODE_ENV;

/**
 * MongoDB
 */
export const MONGODB_ID = process.env.MONGODB_ID;
export const MONGODB_NAME = process.env.MONGODB_NAME;
export const MONGODB_PASS = process.env.MONGODB_PASS;
export const MONGODB_APP_NAME = process.env.MONGODB_APP_NAME;

/**
 * Bcrypt
 * */
export const BCRYPT_SALT = Number(process.env.BCRYPT_SALT);

/**
 * Jwt
 * */
export const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
export const JWT_REFRESH_KEY = process.env.JWT_REFRESH_KEY;
export const JWT_ACCESS_TTL = Number(process.env.JWT_ACCESS_TTL);
export const JWT_REFRESH_TTL = Number(process.env.JWT_REFRESH_TTL);
export const JWT_ACCESS_EXPIRE = process.env.JWT_ACCESS_EXPIRE;
export const JWT_REFRESH_EXPIRE = process.env.JWT_REFRESH_EXPIRE;

/**
 * Redis
 * */
export const REDIS_HOST = process.env.REDIS_HOST;
export const REDIS_PORT = Number(process.env.REDIS_PORT);
export const REDIS_DB = Number(process.env.REDIS_DB);

/**
 * RabbitMQ
 */
export const RABBITMQ_HOST = process.env.RABBITMQ_HOST;
export const RABBITMQ_PORT = Number(process.env.RABBITMQ_PORT);
export const RABBITMQ_USER = process.env.RABBITMQ_USER;
export const RABBITMQ_PASS = process.env.RABBITMQ_PASS;
