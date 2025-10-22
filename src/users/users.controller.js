import { StatusCodes } from 'http-status-codes';
export class UsersController {
  constructor(usersService) {
    this.usersService = usersService;
  }

  // 닉네임 존재 유무 체크
  nicknameCheck = async (req, res) => {
    const { nickname } = req.body;

    await this.usersService.nicknameCheck(nickname);

    return res.status(StatusCodes.OK).json({ message: '사용 가능 합니다.' });
  };

  // 정보 변경 권한 여부 확인
  updatePermission = async (req, res) => {
    const { id } = req.user;
    const { password } = req.body;

    await this.usersService.updatePermission(password, id);

    return res.status(StatusCodes.OK).json({ message: '인증 완료.' });
  };

  // 유저 정보 수정
  update = async (req, res) => {
    const { id } = req.user;
    const { name, newPassword, nickname, gender, birth, phoneNumber } =
      req.body;

    await this.usersService.update(
      name,
      newPassword,
      nickname,
      gender,
      birth,
      phoneNumber,
      id
    );

    return res.status(StatusCodes.OK).json({ message: '유저 정보 수정 완료.' });
  };

  // 유저 회원 탈퇴
  remove = async (req, res) => {
    const { id } = req.user;

    await this.usersService.remove(id);

    return res.status(StatusCodes.OK).json({ message: '회원 탈퇴 완료.' });
  };
}
