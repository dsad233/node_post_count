import express from 'express';
import { prisma } from '../../prisma/prismaClient.js';

import { AuthRepository } from './auth.repository.js';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';

import { SessionValidation } from '../common/middlewares/session-validation.js';

import { CreateUserDto, LoginDto, AuthRequestDto } from './dto/index.js';
import { validate } from '../common/middlewares/validate.js';

const router = express.Router();

const authRepository = new AuthRepository(prisma);
const authService = new AuthService(authRepository);
const authController = new AuthController(authService);

router.post('/signup', validate(CreateUserDto()), authController.signUp);
router.post('/signin', validate(LoginDto()), authController.signIn);
router.post(
  '/reissue',
  validate(AuthRequestDto()),
  SessionValidation,
  authController.reisSue
);
router.post('/signout', SessionValidation, authController.signOut);

export default router;
