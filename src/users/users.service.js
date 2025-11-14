import bcrypt from 'bcrypt';
import { StatusCodes } from 'http-status-codes';
import { BCRYPT_SALT } from '../common/configs/config.js';
import { calculateDuration } from '../common/utils.js';
export class UsersService {
  constructor(usersRepository) {
    this.usersRepository = usersRepository;
  }

  // 닉네임 존재 유무 체크
  nicknameCheck = async (nickname) => {
    const alreadyNickname = await this.usersRepository.findByNickname(nickname);

    if (alreadyNickname) {
      let error = new Error('이미 유효한 닉네임 입니다.');
      error.StatusCodes = StatusCodes.BAD_REQUEST;
      throw error;
    }
  };

  // 유저 마이페이지 조회
  getInfo = async (id) => {
    return await this.usersRepository.getInfo(id);
  };

  // 정보 변경 권한 여부 확인
  updatePermission = async (password, userId) => {
    const user = await this.usersRepository.findById(userId);

    if (!(await bcrypt.compare(password, user.password))) {
      let error = new Error('비밀번호가 일치하지 않습니다.');
      error.StatusCodes = StatusCodes.UNAUTHORIZED;
      throw error;
    }
  };

  // 유저 정보 수정
  update = async (
    name,
    newPassword,
    nickname,
    gender,
    birth,
    phoneNumber,
    id
  ) => {
    if (nickname) {
      const alreadyNickname =
        await this.usersRepository.findByNickname(nickname);

      if (alreadyNickname) {
        let error = new Error('이미 유효한 닉네임 입니다.');
        error.StatusCodes = StatusCodes.BAD_REQUEST;
        throw error;
      }

      // 닉네임 마지막 변경일이 30일 전인지 확인
      const user = await this.usersRepository.findById(id);
      const now = new Date();

      const diifDate = calculateDuration(user.nicknameCheck, now);

      if (diifDate < 30) {
        let error = new Error('닉네임 변경은 30일 이후에 가능합니다.');
        error.StatusCodes = StatusCodes.BAD_REQUEST;
        throw error;
      }
    }

    if (phoneNumber) {
      const alreadyPhoneNumber =
        await this.usersRepository.findByPhoneNumber(phoneNumber);

      if (alreadyPhoneNumber) {
        let error = new Error('이미 유효한 휴대폰 번호 입니다.');
        error.StatusCodes = StatusCodes.BAD_REQUEST;
        throw error;
      }
    }

    const hashPassword = await bcrypt.hash(newPassword, BCRYPT_SALT);

    await this.usersRepository.update(
      name,
      hashPassword,
      nickname,
      gender,
      birth,
      phoneNumber,
      id
    );

    // 닉네임도 변경 요청이 들어왔을 시에 Date 기록
    if (nickname) {
      await this.usersRepository.nicknameSyncUpdate(id);
    }
  };

  // 닉네임이 이미 존재하는 지 확인 유무 API도 작성 필요.

  // 유저 회원 탈퇴
  remove = async (id) => {
    await this.usersRepository.remove(id);
  };
}
