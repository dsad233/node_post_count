import { STATUS } from '../common/enums/index.js';
export class AdminRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  // 유저 pk 조회
  findById = async (id) => {
    return await this.prisma.user.findFirst({
      where: { id },
      select: {
        id: true,
        loginId: true,
        email: true,
        nickname: true,
      },
    });
  };

  // 유저 가입자 수 조회
  count = async () => {
    return await this.prisma.user.count({
      where: { deletedAt: STATUS.Status.FALSE },
    });
  };
}
