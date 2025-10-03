import express from 'express';
import { prisma } from '../../prisma/prismaClient.js';

import { AdminRepository } from './admin.repository.js';
import { AdminService } from './admin.service.js';
import { AdminController } from './admin.controller.js';

import { SessionValidation } from '../common/middlewares/session-validation.js';
import { RoleValidation } from '../common/middlewares/role-validation.js';

import { AdminRequestDto } from './dto/adminRequestDto.js';
import { validate } from '../common/middlewares/validate.js';

const router = express.Router();

const adminRepository = new AdminRepository(prisma);
const adminService = new AdminService(adminRepository);
const adminController = new AdminController(adminService);

// 유저 상세 조회
router.get(
  '/user/:userid',
  validate(AdminRequestDto()),
  SessionValidation,
  RoleValidation,
  adminController.findOne
);

// 유저 가입자 수 조회
router.get(
  '/users/count',
  SessionValidation,
  RoleValidation,
  adminController.count
);

export default router;
