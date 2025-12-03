import bcrypt from 'bcrypt';
import {
  BCRYPT_SALT,
  JWT_ACCESS_TTL,
  JWT_REFRESH_TTL,
} from '../common/configs/config.js';
import { isEmailValid } from '../common/utils.js';
import { StatusCodes } from 'http-status-codes';
import { jwtSign, refreshSign, tokenVerify } from '../jwt/jwt.service.js';
import { TYPE } from '../common/enums/index.js';

export class AuthService {
  constructor(authRepository, redisRepository) {
    this.authRepository = authRepository;
    this.redisRepository = redisRepository;
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
    // 락이 존재 할때 nil을 반환, 락이 존재 하지 않는다면 설정
    const acquiredLock = await this.redisRepository.setnx(
      `${TYPE.PrefixType.LOCKED}:${TYPE.PrefixType.AUTH}`,
      180000,
      'locked'
    );

    if (acquiredLock === null) {
      let error = new Error(
        '많은 요청이 진행되고 있습니다. 잠시 후 다시시도 해주세요.'
      );
      error.StatusCodes = StatusCodes.TOO_MANY_REQUESTS;
      throw error;
    }

    const guestSession = await this.redisRepository.get(
      `${TYPE.PrefixType.SESSION}:type=${TYPE.RoleType.GUEST}:userIp=${userIp}:userAgent=${userAgent}`
    );

    const alreadyLoginId = await this.authRepository.findByLoginId(loginId);

    if (alreadyLoginId) {
      await this.redisRepository.delete(
        `${TYPE.PrefixType.LOCKED}:${TYPE.PrefixType.AUTH}`
      );

      let error = new Error('이미 유효한 아이디 입니다.');
      error.StatusCodes = StatusCodes.BAD_REQUEST;
      throw error;
    }

    if (email) {
      const alreadyEmail = await this.authRepository.findByEmail(email);

      if (alreadyEmail) {
        await this.redisRepository.delete(
          `${TYPE.PrefixType.LOCKED}:${TYPE.PrefixType.AUTH}`
        );

        let error = new Error('이미 유효한 이메일 입니다.');
        error.StatusCodes = StatusCodes.BAD_REQUEST;
        throw error;
      }
    }

    const alreadyNickname = await this.authRepository.findByNickname(nickname);

    if (alreadyNickname) {
      await this.redisRepository.delete(
        `${TYPE.PrefixType.LOCKED}:${TYPE.PrefixType.AUTH}`
      );

      let error = new Error('이미 유효한 닉네임 입니다.');
      error.StatusCodes = StatusCodes.BAD_REQUEST;
      throw error;
    }

    const alreadyPhoneNumber =
      await this.authRepository.findByPhoneNumber(phoneNumber);

    if (alreadyPhoneNumber) {
      await this.redisRepository.delete(
        `${TYPE.PrefixType.LOCKED}:${TYPE.PrefixType.AUTH}`
      );

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
      await this.redisRepository.delete(
        `${TYPE.PrefixType.SESSION}:type=${TYPE.RoleType.GUEST}:userIp=${userIp}:userAgent=${userAgent}`
      );
    }

    if (acquiredLock === 'OK') {
      await this.redisRepository.delete(
        `${TYPE.PrefixType.LOCKED}:${TYPE.PrefixType.AUTH}`
      );
    }

    return true;
  };

  // 로그인
  signIn = async (loginId, password, userIp, userAgent) => {
    const guestSession = await this.redisRepository.get(
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

      await this.redisRepository.setex(
        `${TYPE.PrefixType.SESSION}:type=${TYPE.TokenType.ACCESS}:userId=${alreadyLoginId.id}`,
        JWT_ACCESS_TTL,
        JSON.stringify(accessPayload)
      );
      await this.redisRepository.setex(
        `${TYPE.PrefixType.SESSION}:type=${TYPE.TokenType.REFRESH}:userId=${alreadyLoginId.id}`,
        JWT_REFRESH_TTL,
        JSON.stringify(refreshPayload)
      );

      if (guestSession) {
        await this.redisRepository.delete(
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

      await this.redisRepository.setex(
        `${TYPE.PrefixType.SESSION}:type=${TYPE.TokenType.ACCESS}:userId=${alreadyEmail.id}`,
        JWT_ACCESS_TTL,
        JSON.stringify(accessPayload)
      );
      await this.redisRepository.setex(
        `${TYPE.PrefixType.SESSION}:type=${TYPE.TokenType.REFRESH}:userId=${alreadyEmail.id}`,
        JWT_REFRESH_TTL,
        JSON.stringify(refreshPayload)
      );

      if (guestSession) {
        await this.redisRepository.delete(
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
    await this.redisRepository.delete(
      `${TYPE.PrefixType.SESSION}:type=${TYPE.TokenType.ACCESS}:userId=${verify.id}`
    );
    await this.redisRepository.delete(
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

    await this.redisRepository.setex(
      `${TYPE.PrefixType.SESSION}:type=${TYPE.TokenType.ACCESS}:userId=${user.id}`,
      JWT_ACCESS_TTL,
      JSON.stringify(accessPayload)
    );
    await this.redisRepository.setex(
      `${TYPE.PrefixType.SESSION}:type=${TYPE.TokenType.REFRESH}:userId=${user.id}`,
      JWT_REFRESH_TTL,
      JSON.stringify(refreshPayload)
    );

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  };

  // 로그아웃
  signOut = async (id) => {
    await this.redisRepository.delete(
      `${TYPE.PrefixType.SESSION}:type=${TYPE.TokenType.ACCESS}:userId=${id}`
    );
    await this.redisRepository.delete(
      `${TYPE.PrefixType.SESSION}:type=${TYPE.TokenType.REFRESH}:userId=${id}`
    );
  };
}
