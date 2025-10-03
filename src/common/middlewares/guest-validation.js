import redisClient from '../configs/redis.config.js';
import { prisma } from '../../../prisma/prismaClient.js';
import { JWT_ACCESS_TTL } from '../configs/config.js';
import { tokenVerify } from '../../jwt/jwt.service.js';
import { StatusCodes } from 'http-status-codes';
import { TYPE } from '../enums/index.js';
import { v4 } from 'uuid';
export const GuestValidation = async function (req, res, next) {
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

      next();
    }
  } else {
    if (req.headers['user-agent']) {
      const userAgent = req.headers['user-agent'].trim();
      const userIp = req.ip ? req.ip.trim() : req.ips[0];

      const guestSession = await redisClient.get(
        `${TYPE.PrefixType.SESSION}:type=${TYPE.RoleType.GUEST}:userIp=${userIp}:userAgent=${userAgent}`
      );

      if (!guestSession) {
        const userId = v4();
        const session = {
          id: userId,
          userAgent,
          userIp,
          role: TYPE.RoleType.GUEST,
          date: new Date().toLocaleString('ko-kr'),
        };

        await redisClient.setEx(
          `${TYPE.PrefixType.SESSION}:type=${TYPE.RoleType.GUEST}:userIp=${userIp}:userAgent=${userAgent}`,
          JWT_ACCESS_TTL,
          JSON.stringify(session)
        );

        next();
      } else {
        const parse = JSON.parse(guestSession);
        if (parse.role !== TYPE.RoleType.GUEST) {
          return res.status(StatusCodes.FORBIDDEN).json({
            message: '다시 접속해 주세요.',
          });
        }

        next();
      }
    } else {
      return res.status(StatusCodes.FORBIDDEN).json({
        message: '올바르지 않은 접근 입니다.',
      });
    }
  }
};
