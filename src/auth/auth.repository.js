import { transactionWrapper } from '../common/middlewares/transaction.js';
export class AuthRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  // 유저 pk 조회
  findById = async (id) => {
    return await this.prisma.user.findFirst({
      where: { id: id },
      select: {
        id: true,
        loginId: true,
        email: true,
        name: true,
        nickname: true,
      },
    });
  };

  // 유저 아이디 중복 유무 조회
  findByLoginId = async (loginId) => {
    return await this.prisma.user.findUnique({
      where: { loginId },
      select: {
        id: true,
        loginId: true,
        name: true,
        nickname: true,
        password: true,
      },
    });
  };

  // 유저 이메일 중복 유무 조회
  findByEmail = async (email) => {
    return await this.prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        email: true,
        name: true,
        nickname: true,
        password: true,
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

  // 유저 휴대폰 번호 중복 유무 조회
  findByPhoneNumber = async (phoneNumber) => {
    return await this.prisma.user.findUnique({
      where: { phoneNumber },
      select: {
        id: true,
        phoneNumber: true,
      },
    });
  };

  // 유저 생성
  create = async (
    loginId,
    name,
    email,
    hashPassword,
    nickname,
    gender,
    birth,
    phoneNumber
  ) => {
    await transactionWrapper(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          loginId,
          name,
          email,
          password: hashPassword,
          nickname,
          gender,
          birth: birth ? new Date(birth) : undefined,
          phoneNumber,
        },
      });

      await tx.role.create({
        data: {
          userId: newUser.id,
        },
      });
    });
  };
}
