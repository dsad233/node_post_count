import express from 'express';
import { prisma } from '../../prisma/prismaClient.js';

import { UsersRepository } from './users.repository.js';
import { UsersService } from './users.service.js';
import { UsersController } from './users.controller.js';

import { AsyncWrapper } from '../common/middlewares/async.js';
import { SessionValidation } from '../common/middlewares/session-validation.js';

import {
  CheckPasswordDto,
  UpdateUserDto,
  CheckNicknameDto,
} from './dto/index.js';
import { validate } from '../common/middlewares/validate.js';

const router = express.Router();

const usersRepository = new UsersRepository(prisma);
const usersService = new UsersService(usersRepository);
const usersController = new UsersController(usersService);

router.get(
  '/nickname/check',
  validate(CheckNicknameDto()),
  SessionValidation,
  AsyncWrapper(usersController.nicknameCheck)
);
router.get(
  '/permission',
  validate(CheckPasswordDto()),
  SessionValidation,
  AsyncWrapper(usersController.updatePermission)
);
router.get('/info', SessionValidation, AsyncWrapper(usersController.getInfo));
router.patch(
  '',
  validate(UpdateUserDto()),
  SessionValidation,
  AsyncWrapper(usersController.update)
);
router.delete('', SessionValidation, usersController.remove);

export default router;
