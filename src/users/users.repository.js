import { STATUS } from '../common/enums/index.js';
export class UsersRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  // 유저 pk 조회
  findById = async (id) => {
    return await this.prisma.user.findFirst({
      where: { id },
      select: {
        id: true,
        password: true,
        nickname: true,
        nicknameCheck: true,
      },
    });
  };

  // 유저 닉네임 중복 유무 조회
  findByNickname = async (nickname) => {
    return await this.prisma.user.findUnique({
      where: { nickname },
      select: {
        id: true,
        nickname: true,
      },
    });
  };

  // 유저 핸드폰 번호 중복 유무 조회
  findByPhoneNumber = async (phoneNumber) => {
    return await this.prisma.user.findUnique({
      where: { phoneNumber },
      select: { id: true, phoneNumber: true },
    });
  };

  // 유저 정보 수정
  // 닉네임 한달에 한번 변경 제한 구현 필요
  // 성별 수정도 휴대폰 인증에 포함 시켜야 할듯
  update = async (
    name,
    hashPassword,
    nickname,
    gender,
    birth,
    phoneNumber,
    userId
  ) => {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        name,
        password: hashPassword,
        nickname,
        gender,
        birth: birth ? new Date(birth) : undefined,
        phoneNumber,
      },
    });
  };

  // 닉네임 변경 유무 업데이트
  nicknameSyncUpdate = async (userId) => {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        nicknameCheck: new Date(),
      },
    });
  };

  // 유저 회원 탈퇴
  remove = async (id) => {
    await this.prisma.user.update({
      where: { id },
      data: {
        deletedAt: STATUS.Status.TRUE,
      },
    });
  };
}
