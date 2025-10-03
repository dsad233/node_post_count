import jwt from 'jsonwebtoken';
import {
  JWT_SECRET_KEY,
  JWT_REFRESH_KEY,
  JWT_ACCESS_EXPIRE,
  JWT_REFRESH_EXPIRE,
} from '../common/configs/config.js';
import { StatusCodes } from 'http-status-codes';
import { TYPE } from '../common/enums/index.js';

// access 토큰 생성
export function jwtSign(data) {
  const accessToken = jwt.sign(data, JWT_SECRET_KEY, {
    expiresIn: JWT_ACCESS_EXPIRE,
  });
  return accessToken;
}

// refresh 토큰 생성
export function refreshSign(data) {
  const refreshToken = jwt.sign(data, JWT_REFRESH_KEY, {
    expiresIn: JWT_REFRESH_EXPIRE,
  });
  return refreshToken;
}

// 토큰 검증
export function tokenVerify(tokenType, token) {
  try {
    if (tokenType === TYPE.TokenType.ACCESS) {
      return jwt.verify(token, JWT_SECRET_KEY);
    } else if (tokenType === TYPE.TokenType.REFRESH) {
      return jwt.verify(token, JWT_REFRESH_KEY);
    }
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      let error = new Error('잘못된 토큰입니다.');
      error.StatusCodes = StatusCodes.BAD_REQUEST;
      throw error;
    } else if (err instanceof jwt.TokenExpiredError) {
      let error = new Error('토큰이 만료되었습니다.');
      error.StatusCodes = StatusCodes.UNAUTHORIZED;
      throw error;
    } else if (err instanceof jwt.NotBeforeError) {
      let error = new Error('토큰이 아직 활성화되지 않았습니다.');
      error.StatusCodes = StatusCodes.UNAUTHORIZED;
      throw error;
    } else {
      let error = new Error('잘못된 토큰입니다.');
      error.StatusCodes = StatusCodes.BAD_REQUEST;
      throw error;
    }
  }
}
