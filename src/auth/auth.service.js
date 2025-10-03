import bcrypt from 'bcrypt';
import {
  BCRYPT_SALT,
  JWT_ACCESS_TTL,
  JWT_REFRESH_TTL,
} from '../common/configs/config.js';
import { isEmailValid } from '../common/utils.js';
import { StatusCodes } from 'http-status-codes';
import { jwtSign, refreshSign, tokenVerify } from '../jwt/jwt.service.js';
import redisClient from '../common/configs/redis.config.js';
import { TYPE } from '../common/enums/index.js';

export class AuthService {
  constructor(authRepository) {
    this.authRepository = authRepository;
  }

  // 유저 생성
  signUp = async (
    loginId,
    name,
    email,
    password,
    nickname,
    gender,
    birth,
    phoneNumber,
    userIp,
    userAgent
  ) => {
    const guestSession = await redisClient.get(
      `${TYPE.PrefixType.SESSION}:type=${TYPE.RoleType.GUEST}:userIp=${userIp}:userAgent=${userAgent}`
    );

    const alreadyLoginId = await this.authRepository.findByLoginId(loginId);

    if (alreadyLoginId) {
      let error = new Error('이미 유효한 아이디 입니다.');
      error.StatusCodes = StatusCodes.BAD_REQUEST;
      throw error;
    }

    if (email) {
      const alreadyEmail = await this.authRepository.findByEmail(email);

      if (alreadyEmail) {
        let error = new Error('이미 유효한 이메일 입니다.');
        error.StatusCodes = StatusCodes.BAD_REQUEST;
        throw error;
      }
    }

    const alreadyNickname = await this.authRepository.findByNickname(nickname);

    if (alreadyNickname) {
      let error = new Error('이미 유효한 닉네임 입니다.');
      error.StatusCodes = StatusCodes.BAD_REQUEST;
      throw error;
    }

    const alreadyPhoneNumber =
      await this.authRepository.findByPhoneNumber(phoneNumber);

    if (alreadyPhoneNumber) {
      let error = new Error('이미 유효한 휴대폰 번호 입니다.');
      error.StatusCodes = StatusCodes.BAD_REQUEST;
      throw error;
    }

    const hashPassword = await bcrypt.hash(password, BCRYPT_SALT);

    await this.authRepository.create(
      loginId,
      name,
      email,
      hashPassword,
      nickname,
      gender,
      birth,
      phoneNumber
    );

    if (guestSession) {
      await redisClient.del(
        `${TYPE.PrefixType.SESSION}:type=${TYPE.RoleType.GUEST}:userIp=${userIp}:userAgent=${userAgent}`
      );
    }

    return true;
  };

  // 로그인
  signIn = async (loginId, password, userIp, userAgent) => {
    const guestSession = await redisClient.get(
      `${TYPE.PrefixType.SESSION}:type=${TYPE.RoleType.GUEST}:userIp=${userIp}:userAgent=${userAgent}`
    );

    if (!isEmailValid(loginId)) {
      const alreadyLoginId = await this.authRepository.findByLoginId(loginId);

      if (!alreadyLoginId) {
        let error = new Error('계정이 존재하지 않습니다.');
        error.StatusCodes = StatusCodes.NOT_FOUND;
        throw error;
      }

      if (!(await bcrypt.compare(password, alreadyLoginId.password))) {
        let error = new Error('비밀번호가 일치하지 않습니다.');
        error.StatusCodes = StatusCodes.UNAUTHORIZED;
        throw error;
      }

      const payload = {
        id: alreadyLoginId.id,
        loginId: alreadyLoginId.loginId,
        name: alreadyLoginId.name,
        nickname: alreadyLoginId.nickname,
      };

      const accessToken = jwtSign(payload);
      const refreshToken = refreshSign(payload);

      const now = new Date().toLocaleString('ko-KR');
      const accessPayload = {
        ...payload,
        accessToken,
        date: now,
      };

      const refreshPayload = {
        ...payload,
        refreshToken,
        date: now,
      };

      await redisClient.setEx(
        `${TYPE.PrefixType.SESSION}:type=${TYPE.TokenType.ACCESS}:userId=${alreadyLoginId.id}`,
        JWT_ACCESS_TTL,
        JSON.stringify(accessPayload)
      );
      await redisClient.setEx(
        `${TYPE.PrefixType.SESSION}:type=${TYPE.TokenType.REFRESH}:userId=${alreadyLoginId.id}`,
        JWT_REFRESH_TTL,
        JSON.stringify(refreshPayload)
      );

      if (guestSession) {
        await redisClient.del(
          `${TYPE.PrefixType.SESSION}:type=${TYPE.RoleType.GUEST}:userIp=${userIp}:userAgent=${userAgent}`
        );
      }

      return { accessToken, refreshToken };
    } else {
      const alreadyEmail = await this.authRepository.findByEmail(loginId);

      if (!alreadyEmail) {
        let error = new Error('계정이 존재하지 않습니다.');
        error.StatusCodes = StatusCodes.NOT_FOUND;
        throw error;
      }

      if (!(await bcrypt.compare(password, alreadyEmail.password))) {
        let error = new Error('비밀번호가 일치하지 않습니다.');
        error.StatusCodes = StatusCodes.UNAUTHORIZED;
        throw error;
      }

      const payload = {
        id: alreadyEmail.id,
        email: alreadyEmail.email,
        name: alreadyEmail.name,
        nickname: alreadyEmail.nickname,
      };

      const accessToken = jwtSign(payload);
      const refreshToken = refreshSign(payload);

      const now = new Date().toLocaleString('ko-KR');
      const accessPayload = {
        ...payload,
        accessToken,
        date: now,
      };

      const refreshPayload = {
        ...payload,
        refreshToken,
        date: now,
      };

      await redisClient.setEx(
        `${TYPE.PrefixType.SESSION}:type=${TYPE.TokenType.ACCESS}:userId=${alreadyEmail.id}`,
        JWT_ACCESS_TTL,
        JSON.stringify(accessPayload)
      );
      await redisClient.setEx(
        `${TYPE.PrefixType.SESSION}:type=${TYPE.TokenType.REFRESH}:userId=${alreadyEmail.id}`,
        JWT_REFRESH_TTL,
        JSON.stringify(refreshPayload)
      );

      if (guestSession) {
        await redisClient.del(
          `${TYPE.PrefixType.SESSION}:type=${TYPE.RoleType.GUEST}:userIp=${userIp}:userAgent=${userAgent}`
        );
      }

      return { accessToken, refreshToken };
    }
  };

  // 토큰 재발급
  reisSue = async (refreshToken) => {
    const verify = tokenVerify(TYPE.TokenType.REFRESH, refreshToken);

    const user = await this.authRepository.findById(verify.id);

    // 해당 유저가 loginId로 로그인을 하였을 경우,
    if (verify.loginId) {
      if (verify.loginId !== user.loginId) {
        let error = new Error('해당 유저 정보가 일치하지 않습니다.');
        error.StatusCodes = StatusCodes.UNAUTHORIZED;
        throw error;
      }

      if (verify.name !== user.name) {
        let error = new Error('해당 유저 정보가 일치하지 않습니다.');
        error.StatusCodes = StatusCodes.UNAUTHORIZED;
        throw error;
      }

      if (verify.nickname !== user.nickname) {
        let error = new Error('해당 유저 정보가 일치하지 않습니다.');
        error.StatusCodes = StatusCodes.UNAUTHORIZED;
        throw error;
      }
    } else {
      // 해당 유저가 email로 로그인을 하였을 경우,
      if (verify.email !== user.email) {
        let error = new Error('해당 유저 정보가 일치하지 않습니다.');
        error.StatusCodes = StatusCodes.UNAUTHORIZED;
        throw error;
      }

      if (verify.name !== user.name) {
        let error = new Error('해당 유저 정보가 일치하지 않습니다.');
        error.StatusCodes = StatusCodes.UNAUTHORIZED;
        throw error;
      }

      if (verify.nickname !== user.nickname) {
        let error = new Error('해당 유저 정보가 일치하지 않습니다.');
        error.StatusCodes = StatusCodes.UNAUTHORIZED;
        throw error;
      }
    }

    // 기존 세션 삭제
    await redisClient.del(
      `${TYPE.PrefixType.SESSION}:type=${TYPE.TokenType.ACCESS}:userId=${verify.id}`
    );
    await redisClient.del(
      `${TYPE.PrefixType.SESSION}:type=${TYPE.TokenType.REFRESH}:userId=${verify.id}`
    );

    const payload = {
      id: user.id,
      email: user.email,
      name: user.name,
      nickname: user.nickname,
    };

    const newAccessToken = jwtSign(payload);
    const newRefreshToken = refreshSign(payload);

    // 새로운 세션 생성
    const now = new Date().toLocaleString('ko-KR');
    const accessPayload = {
      ...payload,
      accessToken: newAccessToken,
      date: now,
    };

    const refreshPayload = {
      ...payload,
      refreshToken: newRefreshToken,
      date: now,
    };

    await redisClient.setEx(
      `${TYPE.PrefixType.SESSION}:type=${TYPE.TokenType.ACCESS}:userId=${user.id}`,
      JWT_ACCESS_TTL,
      JSON.stringify(accessPayload)
    );
    await redisClient.setEx(
      `${TYPE.PrefixType.SESSION}:type=${TYPE.TokenType.REFRESH}:userId=${user.id}`,
      JWT_REFRESH_TTL,
      JSON.stringify(refreshPayload)
    );

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  };

  // 로그아웃
  signOut = async (id) => {
    await redisClient.del(
      `${TYPE.PrefixType.SESSION}:type=${TYPE.TokenType.ACCESS}:userId=${id}`
    );
    await redisClient.del(
      `${TYPE.PrefixType.SESSION}:type=${TYPE.TokenType.REFRESH}:userId=${id}`
    );
  };
}
