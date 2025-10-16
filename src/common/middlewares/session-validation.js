import { tokenVerify } from '../../jwt/jwt.service.js';
import { TYPE } from '../enums/index.js';
import { prisma } from '../../../prisma/prismaClient.js';
import { StatusCodes } from 'http-status-codes';
export const SessionValidation = async function (req, res, next) {
  if (req.headers.authorization) {
    const [type, token] = req.headers.authorization.split(' ');

    if (type.toLowerCase() !== 'bearer') {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: '토큰 타입이 올바르지 않습니다.' });
    }

    if (token.length) {
      const session = tokenVerify(TYPE.TokenType.ACCESS, token);
      const user = await prisma.user.findFirst({
        where: {
          id: session.id,
        },
        include: {
          roles: true,
        },
      });

      if (!user) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: '유저 데이터가 존재하지 않습니다.' });
      }

      req.user = user;
      next();
    }
  } else {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: '로그인을 시도해 주세요.' });
  }
};
