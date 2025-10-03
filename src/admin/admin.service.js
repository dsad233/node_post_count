import { StatusCodes } from "http-status-codes";
export class AdminService {
  constructor(adminRepository) {
    this.adminRepository = adminRepository;
  }

  // 유저 상세 조회
  findOne = async (userId) => {
    const user = await this.adminRepository.findById(userId);

    if (!user) {
      let error = new Error("해당 유저가 존재하지 않습니다.");
      error.StatusCodes = StatusCodes.NOT_FOUND;
      throw error;
    }

    return user;
  };

  // 유저 가입자 수 조회
  count = async () => {
    return await this.adminRepository.count();
  };
}
