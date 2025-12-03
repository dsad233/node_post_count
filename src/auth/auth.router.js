import express from 'express';
import { prisma } from '../../prisma/prismaClient.js';
import redis from '../common/configs/redis.config.js';
import { RedisRepository } from '../redis/redis.repository.js';

import { AuthRepository } from './auth.repository.js';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';

import { AsyncWrapper } from '../common/middlewares/async.js';
import { SessionValidation } from '../common/middlewares/session-validation.js';

import { CreateUserDto, LoginDto, AuthRequestDto } from './dto/index.js';
import { validate } from '../common/middlewares/validate.js';

const router = express.Router();

const redisRepository = new RedisRepository(redis);

const authRepository = new AuthRepository(prisma);
const authService = new AuthService(authRepository, redisRepository);
const authController = new AuthController(authService);

router.post(
  '/signup',
  validate(CreateUserDto()),
  AsyncWrapper(authController.signUp)
);
router.post('/signin', validate(LoginDto()), authController.signIn);
router.post(
  '/reissue',
  validate(AuthRequestDto()),
  SessionValidation,
  AsyncWrapper(authController.reisSue)
);
router.post(
  '/signout',
  SessionValidation,
  AsyncWrapper(authController.signOut)
);

export default router;
