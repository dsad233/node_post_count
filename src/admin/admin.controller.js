import { StatusCodes } from 'http-status-codes';
export class AdminController {
  constructor(adminService) {
    this.adminService = adminService;
  }

  // 유저 상세 조회
  findOne = async (req, res) => {
    const { userid } = req.params;

    const user = await this.adminService.findOne(userid);

    return res
      .status(StatusCodes.OK)
      .json({ message: '유저 상세 조회 완료.', data: user });
  };

  // 유저 가입자 수 조회
  count = async (req, res) => {
    const count = await this.adminService.count();

    return res
      .status(StatusCodes.OK)
      .json({ message: '현재 가입자 수 조회 완료.', count: count });
  };
}
