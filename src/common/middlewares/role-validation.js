import { TYPE } from '../enums/index.js';
import { StatusCodes } from 'http-status-codes';
export const RoleValidation = async function (req, res, next) {
  if (req.user) {
    const { roles } = req.user;

    if (roles.role !== TYPE.RoleType.ADMIN) {
      return res.status(StatusCodes.FORBIDDEN).json({
        message: '접근 권한이 없습니다.',
      });
    }

    next();
  } else {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: '로그인을 시도해 주세요.' });
  }
};
